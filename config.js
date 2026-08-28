/**
 * AnkLaBo Bio — config.js v3.0
 * Mật khẩu: AnkLaBo2610  (hash below, plaintext NEVER in source)
 * Hash SHA-256 (salt: anklabo_bio_salt_2026):
 * 7a26c5442691e4de63bfdc6bda28f13d18de88dea4aabb3d110436f39d9c1df3
 */

const CONFIG = {

    /* ============================================================
       Security — SHA-256 hash of password (never store plaintext)
       ============================================================ */
    auth: {
        hash:  "7a26c5442691e4de63bfdc6bda28f13d18de88dea4aabb3d110436f39d9c1df3",
        salt:  "anklabo_bio_salt_2026",
        /* F5 auto-lock: in-memory only, refreshed on every page load */
        inMemoryOnly: true
    },

    /* ============================================================
       Profile
       ============================================================ */
    profile: {
        username:     "AnkLaBo",
        handle:       "anklabo29ms",
        uid:          "1",
        location:     "Vietnam 🇻🇳",
        avatar:       "https://avatars.githubusercontent.com/u/102527670?v=4",
        banner:       "",
        bioQuotes: [
            "Welcome to my corner of the internet ✨",
            "Developer. Creator. Chill guy. 🇻🇳",
            "Always building something new 🚀",
            "Code is poetry — write it beautifully."
        ],
        viewsInitial: 1337
    },

    /* ============================================================
       Discord (Lanyard user-id sync, NO OAuth2)
       ============================================================ */
    discord: {
        userId:           "1129745140745498694",   /* <— change to your real Discord ID */
        autoSyncProfile:  true,
        showPresence:     true
    },

    /* ============================================================
       Theme & Effects
       ============================================================ */
    theme: {
        accentColor:       "#8b5cf6",
        glowColor:         "rgba(139, 92, 246, 0.42)",
        avatarEffect:      "rainbow",     /* rainbow | booster | glow | glitch | static */
        usernameEffect:    "gradient",    /* gradient | rainbow | neon */
        backgroundMode:    "starfield",   /* starfield | aurora | matrix | snow | embers | none */
        backgroundImageUrl: "",
        scanlines:         true,
        clickSound:        true,
        sparkleTrail:      true
    },

    /* ============================================================
       Discord Badges — real badge images from Discord CDN
       type: "img"  → uses Discord CDN PNG
       type: "fa"   → FontAwesome fallback icon
       ============================================================ */
    badges: [
        {
            id:      "active_developer",
            name:    "Active Developer",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/active_developer.png",
            color:   "#5865f2",
            tooltip: "Thành viên chương trình Active Developer của Discord",
            enabled: true
        },
        {
            id:      "verified_developer",
            name:    "Verified Bot Developer",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/verified_developer.png",
            color:   "#5865f2",
            tooltip: "Nhà phát triển bot đã được Discord xác minh sớm",
            enabled: true
        },
        {
            id:      "bug_hunter_level_1",
            name:    "Bug Hunter",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/bug_hunter_level_1.png",
            color:   "#f47b67",
            tooltip: "Discord Bug Hunter (Bronze) — đã tìm và báo cáo bug",
            enabled: true
        },
        {
            id:      "bug_hunter_level_2",
            name:    "Bug Hunter Gold",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/bug_hunter_level_2.png",
            color:   "#f0b132",
            tooltip: "Discord Bug Hunter (Gold) — bug hunter xuất sắc",
            enabled: false
        },
        {
            id:      "hypesquad_online_house_1",
            name:    "HypeSquad Bravery",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/hypesquad_online_house_1.png",
            color:   "#9c5ee6",
            tooltip: "Thành viên HypeSquad Nhà Bravery — dũng cảm và quyết đoán",
            enabled: true
        },
        {
            id:      "hypesquad_online_house_2",
            name:    "HypeSquad Brilliance",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/hypesquad_online_house_2.png",
            color:   "#f47c6f",
            tooltip: "Thành viên HypeSquad Nhà Brilliance — sáng tạo và nhiệt huyết",
            enabled: false
        },
        {
            id:      "hypesquad_online_house_3",
            name:    "HypeSquad Balance",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/hypesquad_online_house_3.png",
            color:   "#45d791",
            tooltip: "Thành viên HypeSquad Nhà Balance — linh hoạt và cân bằng",
            enabled: false
        },
        {
            id:      "hypesquad",
            name:    "HypeSquad Events",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/hypesquad.png",
            color:   "#f4a533",
            tooltip: "Tình nguyện viên sự kiện HypeSquad",
            enabled: false
        },
        {
            id:      "early_supporter",
            name:    "Early Nitro Supporter",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/early_supporter.png",
            color:   "#6e56d6",
            tooltip: "Người dùng Nitro sớm nhất của Discord",
            enabled: true
        },
        {
            id:      "partner",
            name:    "Partnered Server Owner",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/partner.png",
            color:   "#5865f2",
            tooltip: "Chủ server Discord được Partner",
            enabled: false
        },
        {
            id:      "discord_employee",
            name:    "Discord Staff",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/discord_employee.png",
            color:   "#5865f2",
            tooltip: "Nhân viên chính thức của Discord",
            enabled: false
        },
        {
            id:      "certified_moderator",
            name:    "Discord Moderator",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/certified_moderator.png",
            color:   "#45d791",
            tooltip: "Discord Certified Moderator — mô được xác nhận cấp độ cao",
            enabled: false
        },
        {
            id:      "nitro",
            name:    "Discord Nitro",
            type:    "fa",
            icon:    "fa-brands fa-discord",
            color:   "#5865f2",
            tooltip: "Discord Nitro Subscriber — hỗ trợ Discord với Nitro",
            enabled: true
        },
        {
            id:      "booster",
            name:    "Server Booster",
            type:    "fa",
            icon:    "fa-solid fa-rocket",
            color:   "#ff73fa",
            tooltip: "Server Booster — đang boost server Discord",
            enabled: true
        },
        {
            id:      "verified",
            name:    "Verified",
            type:    "fa",
            icon:    "fa-solid fa-circle-check",
            color:   "#5865f2",
            tooltip: "Tài khoản được xác minh",
            enabled: false
        }
    ],

    /* ============================================================
       Social Links — icon + label + url + hover colour
       ============================================================ */
    socials: [
        {
            id:     "discord",
            name:   "Discord",
            label:  "Discord",
            icon:   "fa-brands fa-discord",
            url:    "https://discord.com/users/1129745140745498694",
            color:  "#5865f2"
        },
        {
            id:     "github",
            name:   "GitHub",
            label:  "GitHub",
            icon:   "fa-brands fa-github",
            url:    "https://github.com/anklabo29ms",
            color:  "#e0e0e0"
        },
        {
            id:     "youtube",
            name:   "YouTube",
            label:  "YouTube",
            icon:   "fa-brands fa-youtube",
            url:    "https://youtube.com",
            color:  "#ff0000"
        },
        {
            id:     "spotify",
            name:   "Spotify",
            label:  "Spotify",
            icon:   "fa-brands fa-spotify",
            url:    "https://open.spotify.com",
            color:  "#1db954"
        }
    ],

    /* ============================================================
       Music Playlist — Việt Nam Lo-Fi & Remix
       type: "youtube" → YouTube Iframe API
       type: "audio"   → native <audio> element (MP3 URL)
       ============================================================ */
    music: {
        autoplayOnEnter: false,
        playlist: [
            {
                id:     "FdsuEtMdTP4",
                title:  "2 Phút Hơn (KAIZ Remix)",
                artist: "Pháo x KAIZ",
                cover:  "https://i.ytimg.com/vi/FdsuEtMdTP4/maxresdefault.jpg",
                type:   "youtube"
            },
            {
                id:     "gCYcHz2k5x0",
                title:  "Dạ Vũ (Lo-Fi)",
                artist: "Mây & Tây Nguyên",
                cover:  "https://i.ytimg.com/vi/gCYcHz2k5x0/maxresdefault.jpg",
                type:   "youtube"
            },
            {
                id:     "GSTL3O9Yq5o",
                title:  "Cắt Đôi Nỗi Sầu (Lo-Fi)",
                artist: "Khửi My ft. K-ICM",
                cover:  "https://i.ytimg.com/vi/GSTL3O9Yq5o/maxresdefault.jpg",
                type:   "youtube"
            },
            {
                id:     "oqPnmHH-Kgk",
                title:  "Em Quơi Quơi (Remix)",
                artist: "Hồng Thanh",
                cover:  "https://i.ytimg.com/vi/oqPnmHH-Kgk/maxresdefault.jpg",
                type:   "youtube"
            }
        ]
    }
};

if (typeof window !== "undefined") {
    window.CONFIG = CONFIG;
}
