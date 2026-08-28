/**
 * discord.js v3.0 — Lanyard WebSocket + REST sync
 * Handles: Avatar, Banner, Avatar Decoration, Status, Spotify Progress Bar
 * NO OAuth2. Powered 100% by Lanyard User ID.
 */

class DiscordManager {
    constructor(config, onProfileUpdate, onPresenceUpdate) {
        this.config = config;
        this.onProfileUpdate = onProfileUpdate;
        this.onPresenceUpdate = onPresenceUpdate;
        this._ws = null;
        this._hbInterval = null;
        this._spotifyProgressInterval = null;
        this._spotifyData = null;
    }

    /** Public entry point — initialise with a Discord User ID */
    initLanyard(userId) {
        if (!userId) return;
        this._userId = userId;
        this._connectWebSocket(userId);
    }

    _connectWebSocket(userId) {
        if (this._ws) {
            try { this._ws.close(); } catch(e) {}
        }

        const ws = new WebSocket("wss://api.lanyard.rest/socket");
        this._ws = ws;

        ws.addEventListener("open", () => {
            ws.send(JSON.stringify({
                op: 2,
                d: { subscribe_to_id: userId }
            }));
        });

        ws.addEventListener("message", (evt) => {
            let msg;
            try { msg = JSON.parse(evt.data); } catch(e) { return; }

            if (msg.op === 1) {
                // Heartbeat request
                this._hbInterval && clearInterval(this._hbInterval);
                this._hbInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ op: 3 }));
                    }
                }, msg.d.heartbeat_interval);
            }

            if (msg.op === 0) {
                const data = msg.d;
                if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
                    this._handleLanyardData(data);
                }
            }
        });

        ws.addEventListener("close", () => {
            clearInterval(this._hbInterval);
            // Reconnect after 5 s
            setTimeout(() => this._connectWebSocket(userId), 5000);
        });

        ws.addEventListener("error", () => {
            try { ws.close(); } catch(e) {}
        });
    }

    _handleLanyardData(data) {
        if (!data) return;
        const u = data.discord_user;

        /* === Profile Update (avatar, banner, decoration) === */
        if (u && this.config.discord.autoSyncProfile) {
            const profilePayload = {};

            // Avatar
            if (u.avatar) {
                const isGif = u.avatar.startsWith("a_");
                profilePayload.avatar =
                    `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${isGif ? "gif" : "png"}?size=512`;
            }

            // Banner
            if (u.banner) {
                const isGifBanner = u.banner.startsWith("a_");
                profilePayload.banner =
                    `https://cdn.discordapp.com/banners/${u.id}/${u.banner}.${isGifBanner ? "gif" : "png"}?size=1024`;
            }

            // Avatar Decoration (Nitro frame effect)
            if (u.avatar_decoration_data && u.avatar_decoration_data.asset) {
                const asset = u.avatar_decoration_data.asset;
                profilePayload.decoration =
                    `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png`;
            } else {
                profilePayload.decoration = null;
            }

            // Display name
            profilePayload.username = u.global_name || u.username;
            profilePayload.handle   = u.username;

            this.onProfileUpdate && this.onProfileUpdate(profilePayload);
        }

        /* === Presence Update (Spotify, Game, Custom Status) === */
        if (!this.config.discord.showPresence) {
            this.onPresenceUpdate && this.onPresenceUpdate(null);
            return;
        }

        const presence = {
            status:       data.discord_status || "offline",
            spotify:      null,
            game:         null,
            customStatus: null
        };

        // Spotify
        if (data.listening_to_spotify && data.spotify) {
            const sp = data.spotify;
            presence.spotify = {
                song:          sp.song,
                artist:        sp.artist,
                albumArtUrl:   sp.album_art_url,
                albumName:     sp.album,
                startTimestamp: sp.timestamps ? sp.timestamps.start : null,
                endTimestamp:   sp.timestamps ? sp.timestamps.end   : null
            };
            this._spotifyData = presence.spotify;
            this._startSpotifyProgress(presence.spotify);
        } else {
            this._spotifyData = null;
            this._stopSpotifyProgress();
        }

        // Game activity (exclude Spotify)
        if (data.activities && data.activities.length > 0) {
            for (const act of data.activities) {
                if (act.type === 2) continue; // Spotify already handled
                if (act.type === 4) {
                    // Custom Status
                    presence.customStatus = {
                        text:  act.state || "",
                        emoji: act.emoji ? (act.emoji.name || "") : ""
                    };
                } else if (act.type === 0 && !presence.game) {
                    // Playing a game
                    presence.game = {
                        name:    act.name,
                        details: act.details || null,
                        state:   act.state   || null,
                        id:      act.application_id || null,
                        assets:  act.assets  || null
                    };
                }
            }
        }

        this.onPresenceUpdate && this.onPresenceUpdate(presence);
    }

    /** Start Spotify real-time progress bar updates */
    _startSpotifyProgress(spotify) {
        this._stopSpotifyProgress();
        if (!spotify.startTimestamp || !spotify.endTimestamp) return;

        const updateProgress = () => {
            const now        = Date.now();
            const total      = spotify.endTimestamp - spotify.startTimestamp;
            const elapsed    = now - spotify.startTimestamp;
            const pct        = Math.min((elapsed / total) * 100, 100);

            const fillEl = document.querySelector(".spotify-progress-fill");
            if (fillEl) fillEl.style.width = `${pct}%`;

            if (pct >= 100) this._stopSpotifyProgress();
        };

        updateProgress();
        this._spotifyProgressInterval = setInterval(updateProgress, 1000);
    }

    _stopSpotifyProgress() {
        if (this._spotifyProgressInterval) {
            clearInterval(this._spotifyProgressInterval);
            this._spotifyProgressInterval = null;
        }
    }

    /** Fetch via REST (fallback when WebSocket unavailable) */
    async fetchRest(userId) {
        try {
            const res  = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
            if (!res.ok) throw new Error(`Lanyard REST ${res.status}`);
            const body = await res.json();
            if (body.success) this._handleLanyardData(body.data);
        } catch (e) {
            console.warn("[Lanyard REST] fetch failed:", e);
        }
    }
}

if (typeof window !== "undefined") {
    window.DiscordManager = DiscordManager;
}
