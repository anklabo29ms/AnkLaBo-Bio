/**
 * Discord Integration Module for AnkLaBo Bio
 * Hỗ trợ:
 * 1. Discord OAuth2 (/users/@me) để fetch toàn bộ profile giống guns.lol / zyo.lol
 * 2. Lanyard WebSocket & REST API để hiển thị trạng thái Real-time (Status, Spotify, Game)
 */

class DiscordManager {
    constructor(config, onProfileUpdate, onPresenceUpdate) {
        this.config = config.discord || {};
        this.authConfig = config.auth || {};
        this.onProfileUpdate = onProfileUpdate || (() => {});
        this.onPresenceUpdate = onPresenceUpdate || (() => {});
        
        this.socket = null;
        this.heartbeatInterval = null;
        this.currentUser = null;

        // Tự động kiểm tra callback sau khi login Discord
        this.handleOAuthCallback();

        // Khởi động kết nối Lanyard nếu có userId
        if (this.config.userId) {
            this.initLanyard(this.config.userId);
        }
    }

    /**
     * Bắt đầu luồng đăng nhập Discord OAuth2
     */
    loginWithDiscord(customClientId = null) {
        const clientId = customClientId || this.authConfig.discordClientId;
        if (!clientId) {
            alert("Vui lòng cấu hình Discord Client ID trong phần Cài đặt trước khi dùng OAuth2!");
            return;
        }

        const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
        const scope = encodeURIComponent("identify");
        const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
        
        window.location.href = oauthUrl;
    }

    /**
     * Xử lý token trả về từ Discord OAuth2 trong URL hash
     */
    async handleOAuthCallback() {
        if (!window.location.hash || !window.location.hash.includes("access_token")) return;

        try {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = params.get("access_token");

            if (accessToken) {
                // Xóa token khỏi URL để bảo mật và giữ URL sạch đẹp
                window.history.replaceState(null, "", window.location.pathname + window.location.search);

                // Fetch thông tin người dùng từ Discord API v10
                const res = await fetch("https://discord.com/api/v10/users/@me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (!res.ok) throw new Error("Không thể tải thông tin Discord");
                const data = await res.json();
                
                this.currentUser = data;
                this.processDiscordUserData(data);

                // Thông báo người dùng
                if (typeof window.showBioToast === "function") {
                    window.showBioToast("🎉 Đã kết nối thành công với tài khoản Discord " + (data.global_name || data.username));
                }
            }
        } catch (err) {
            console.error("Lỗi khi xử lý Discord OAuth:", err);
        }
    }

    /**
     * Xử lý dữ liệu trả về từ Discord API và kích hoạt cập nhật giao diện
     */
    processDiscordUserData(user) {
        const isGif = user.avatar && user.avatar.startsWith("a_");
        const avatarUrl = user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${isGif ? "gif" : "png"}?size=512`
            : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.discriminator || "0") % 5)}.png`;

        const bannerUrl = user.banner
            ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith("a_") ? "gif" : "png"}?size=1024`
            : null;

        const profileData = {
            id: user.id,
            username: user.global_name || user.username,
            handle: user.username,
            avatar: avatarUrl,
            banner: bannerUrl,
            accentColor: user.accent_color ? `#${user.accent_color.toString(16).padStart(6, "0")}` : null,
            badges: this.extractDiscordBadges(user.public_flags || 0)
        };

        // Lưu vào bộ nhớ tạm
        localStorage.setItem("anklabo_discord_synced_profile", JSON.stringify(profileData));

        // Callback cập nhật UI
        this.onProfileUpdate(profileData);

        // Kích hoạt Lanyard cho ID mới nếu có
        this.initLanyard(user.id);
    }

    /**
     * Giải mã các huy hiệu Discord từ public_flags
     */
    extractDiscordBadges(flags) {
        const badges = [];
        const BADGE_MAP = {
            1: { id: "staff", name: "Discord Staff", icon: "fa-solid fa-shield", color: "#5865F2" },
            2: { id: "partner", name: "Partnered Server Owner", icon: "fa-solid fa-handshake", color: "#5865F2" },
            4: { id: "hypesquad", name: "HypeSquad Events", icon: "fa-solid fa-fire", color: "#FEE75C" },
            8: { id: "bug_hunter_1", name: "Bug Hunter Level 1", icon: "fa-solid fa-bug", color: "#57F287" },
            64: { id: "bravery", name: "HypeSquad Bravery", icon: "fa-solid fa-shield-halved", color: "#9B59B6" },
            128: { id: "brilliance", name: "HypeSquad Brilliance", icon: "fa-solid fa-bolt", color: "#E67E22" },
            256: { id: "balance", name: "HypeSquad Balance", icon: "fa-solid fa-scale-balanced", color: "#2ECC71" },
            512: { id: "early_supporter", name: "Early Supporter", icon: "fa-solid fa-gem", color: "#EB459E" },
            16384: { id: "bug_hunter_2", name: "Bug Hunter Level 2", icon: "fa-solid fa-shield-virus", color: "#FEE75C" },
            131072: { id: "dev", name: "Early Verified Bot Developer", icon: "fa-solid fa-code", color: "#5865F2" },
            4194304: { id: "active_dev", name: "Active Developer", icon: "fa-solid fa-terminal", color: "#57F287" }
        };

        for (const [flag, badge] of Object.entries(BADGE_MAP)) {
            if ((flags & parseInt(flag)) === parseInt(flag)) {
                badges.push(badge);
            }
        }
        return badges;
    }

    /**
     * Khởi tạo kết nối Lanyard REST & WebSocket
     */
    async initLanyard(userId) {
        if (!userId) return;

        // 1. Fetch ngay lập tức qua Lanyard REST API
        try {
            const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
            if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) {
                    this.handleLanyardData(json.data);
                }
            }
        } catch (e) {
            console.warn("Không thể fetch Lanyard REST:", e);
        }

        // 2. Kết nối WebSocket để nhận dữ liệu thời gian thực
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
                    case 1: // Hello -> Khởi tạo heartbeat và đăng ký theo dõi User ID
                        const heartbeatInterval = data.d.heartbeat_interval;
                        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
                        this.heartbeatInterval = setInterval(() => {
                            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                                this.socket.send(JSON.stringify({ op: 3 }));
                            }
                        }, heartbeatInterval);

                        // Gửi subscribe
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
                // Tự động kết nối lại sau 5s
                setTimeout(() => this.connectLanyardSocket(userId), 5000);
            };
        } catch (err) {
            console.warn("Lỗi kết nối Lanyard WebSocket:", err);
        }
    }

    /**
     * Xử lý dữ liệu presence từ Lanyard
     */
    handleLanyardData(data) {
        if (!data) return;

        const discordUser = data.discord_user;
        const status = data.discord_status || "offline"; // online, idle, dnd, offline
        const spotify = data.spotify; // Bài hát đang nghe trên Spotify nếu có
        const activities = data.activities || [];

        // Tìm hoạt động game đang chơi (không phải Spotify hay Custom Status)
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

        // Nếu bật autoSyncProfile và có discordUser, cập nhật avatar/username
        if (this.config.autoSyncProfile && discordUser) {
            const isGif = discordUser.avatar && discordUser.avatar.startsWith("a_");
            const avatarUrl = discordUser.avatar 
                ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${isGif ? "gif" : "png"}?size=512`
                : null;

            if (avatarUrl) {
                this.onProfileUpdate({
                    id: discordUser.id,
                    username: discordUser.global_name || discordUser.username,
                    avatar: avatarUrl
                });
            }
        }

        // Callback cập nhật Presence
        this.onPresenceUpdate(presencePayload);
    }
}

if (typeof window !== "undefined") {
    window.DiscordManager = DiscordManager;
}
