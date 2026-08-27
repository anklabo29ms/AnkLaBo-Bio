/**
 * Discord Integration Module for AnkLaBo Bio
 * Tối ưu hóa 100% cho Lanyard API qua Discord User ID (Không cần OAuth2 phức tạp)
 * - Tự động fetch Avatar, Banner, Tên hiển thị
 * - WebSocket kết nối real-time trạng thái Online/Idle/DND/Offline
 * - Hiển thị bài nhạc Spotify đang nghe (kèm tiến độ bài) hoặc game đang chơi
 */

class DiscordManager {
    constructor(config, onProfileUpdate, onPresenceUpdate) {
        this.config = config.discord || {};
        this.onProfileUpdate = onProfileUpdate || (() => {});
        this.onPresenceUpdate = onPresenceUpdate || (() => {});
        
        this.socket = null;
        this.heartbeatInterval = null;

        // Khởi động kết nối Lanyard nếu có userId
        if (this.config.userId) {
            this.initLanyard(this.config.userId);
        }
    }

    /**
     * Khởi tạo kết nối Lanyard REST & WebSocket theo Discord User ID
     */
    async initLanyard(userId) {
        if (!userId) return;

        // 1. Fetch REST API ngay lập tức
        try {
            const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
            if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) {
                    this.handleLanyardData(json.data);
                }
            }
        } catch (e) {
            console.warn("Không thể tải Lanyard REST:", e);
        }

        // 2. Kết nối WebSocket để cập nhật Real-time
        this.connectLanyardSocket(userId);
    }

    connectLanyardSocket(userId) {
        if (this.socket) {
            try { this.socket.close(); } catch (e) {}
        }

        try {
            this.socket = new WebSocket("wss://api.lanyard.rest/socket");

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                switch (data.op) {
                    case 1: // Hello -> Subscribe User ID
                        const heartbeatInterval = data.d.heartbeat_interval;
                        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
                        this.heartbeatInterval = setInterval(() => {
                            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                                this.socket.send(JSON.stringify({ op: 3 }));
                            }
                        }, heartbeatInterval);

                        this.socket.send(JSON.stringify({
                            op: 2,
                            d: { subscribe_to_id: userId }
                        }));
                        break;

                    case 0: // Event data (INIT_STATE hoặc PRESENCE_UPDATE)
                        if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
                            this.handleLanyardData(data.d);
                        }
                        break;
                }
            };

            this.socket.onclose = () => {
                if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
                setTimeout(() => this.connectLanyardSocket(userId), 5000);
            };
        } catch (err) {
            console.warn("Lỗi kết nối Lanyard WebSocket:", err);
        }
    }

    /**
     * Xử lý dữ liệu Lanyard Presence
     */
    handleLanyardData(data) {
        if (!data) return;

        const discordUser = data.discord_user;
        const status = data.discord_status || "offline";
        const spotify = data.spotify;
        const activities = data.activities || [];

        // Tìm hoạt động game đang chơi
        const gameActivity = activities.find(act => act.type === 0);
        // Custom status
        const customStatus = activities.find(act => act.type === 4);

        const presencePayload = {
            status: status,
            discordUser: discordUser,
            spotify: spotify ? {
                song: spotify.song,
                artist: spotify.artist,
                album: spotify.album,
                albumArtUrl: spotify.album_art_url,
                timestamps: spotify.timestamps
            } : null,
            game: gameActivity ? {
                name: gameActivity.name,
                details: gameActivity.details || "",
                state: gameActivity.state || "",
                assets: gameActivity.assets
            } : null,
            customStatus: customStatus ? {
                text: customStatus.state || "",
                emoji: customStatus.emoji ? customStatus.emoji.name : ""
            } : null
        };

        // Nếu bật autoSyncProfile và có discordUser, cập nhật avatar/banner/tên
        if (this.config.autoSyncProfile && discordUser) {
            const isGif = discordUser.avatar && discordUser.avatar.startsWith("a_");
            const avatarUrl = discordUser.avatar 
                ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${isGif ? "gif" : "png"}?size=512`
                : null;

            const bannerUrl = discordUser.banner
                ? `https://cdn.discordapp.com/banners/${discordUser.id}/${discordUser.banner}.${discordUser.banner.startsWith("a_") ? "gif" : "png"}?size=1024`
                : null;

            this.onProfileUpdate({
                id: discordUser.id,
                username: discordUser.global_name || discordUser.username,
                handle: discordUser.username,
                avatar: avatarUrl,
                banner: bannerUrl
            });
        }

        // Callback cập nhật Presence
        this.onPresenceUpdate(presencePayload);
    }
}

if (typeof window !== "undefined") {
    window.DiscordManager = DiscordManager;
}
