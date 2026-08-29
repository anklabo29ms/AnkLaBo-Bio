/**
 * AnkLaBo Bio — config.js v3.2
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
        userId:           "1129745140745498694",
        autoSyncProfile:  true,
        showPresence:     true
    },

    /* ============================================================
       Theme & Effects
       ============================================================ */
    theme: {
        accentColor:       "#8b5cf6",
        glowColor:         "rgba(139, 92, 246, 0.42)",
        avatarEffect:      "rainbow",
        usernameEffect:    "gradient",
        backgroundMode:    "starfield",
        backgroundImageUrl: "",
        scanlines:         true,
        clickSound:        true,
        sparkleTrail:      true
    },

    /* ============================================================
       Discord Badges — Complete Official Badge List (30 badges)
       Sorted by category:
         1. Subscription / Paid
         2. Activity Progression (New 2025-2026)
         3. Rare & Special
         4. Legacy & Unobtainable

       type: "img"  -> CDN PNG (Fluency Icons / Discord CDN)
       type: "fa"   -> FontAwesome icon (fallback for newer badges)

       enabled: false = hidden by default, toggle in Config Panel
       ============================================================ */
    badges: [

        /* -------- 1. SUBSCRIPTION / PAID -------- */
        {
            id:      "nitro",
            name:    "Discord Nitro",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-nitro-badge.png",
            color:   "#5865f2",
            tooltip: "Discord Nitro Subscriber — hỗ trợ Discord với gói Nitro đang hoạt động",
            enabled: true
        },
        {
            id:      "booster_lvl1",
            name:    "Server Booster (1 tháng)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl1.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 1 — boost server liên tục 1 tháng",
            enabled: false
        },
        {
            id:      "booster_lvl2",
            name:    "Server Booster (2 tháng)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl2.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 2 — boost server liên tục 2 tháng",
            enabled: false
        },
        {
            id:      "booster_lvl3",
            name:    "Server Booster (3 tháng)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl3.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 3 — boost server liên tục 3 tháng",
            enabled: true
        },
        {
            id:      "booster_lvl4",
            name:    "Server Booster (6 tháng)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl4.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 4 — boost server liên tục 6 tháng",
            enabled: false
        },
        {
            id:      "booster_lvl5",
            name:    "Server Booster (9 tháng)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl5.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 5 — boost server liên tục 9 tháng",
            enabled: false
        },
        {
            id:      "booster_lvl6",
            name:    "Server Booster (12 tháng)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl6.png",
            color:   "#e040fb",
            tooltip: "Server Booster Tier 6 — boost server liên tục 12 tháng",
            enabled: false
        },
        {
            id:      "booster_lvl7",
            name:    "Server Booster (15 tháng)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl7.png",
            color:   "#e040fb",
            tooltip: "Server Booster Tier 7 — boost server liên tục 15 tháng",
            enabled: false
        },
        {
            id:      "booster_lvl8",
            name:    "Server Booster (18 tháng)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl8.png",
            color:   "#e040fb",
            tooltip: "Server Booster Tier 8 — boost server liên tục 18 tháng",
            enabled: false
        },
        {
            id:      "booster_lvl9",
            name:    "Server Booster (24 tháng – Max)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl9.png",
            color:   "#a855f7",
            tooltip: "Server Booster Tier 9 — boost server liên tục 24+ tháng — mức đỉnh cao nhất!",
            enabled: false
        },
        {
            id:      "discord_quests",
            name:    "Discord Quests",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/questsrewardedv1.png",
            color:   "#f59e0b",
            tooltip: "Discord Quests — hoàn thành nhiệm vụ chơi game theo thời gian giới hạn qua Gift Inventory",
            enabled: false
        },
        {
            id:      "orbs_apprentice",
            name:    "Orbs Apprentice",
            type:    "fa",
            icon:    "fa-solid fa-circle-nodes",
            color:   "#06b6d4",
            tooltip: "Orbs Apprentice — mức học viên trong hệ thống Orb nội bộ của Discord",
            enabled: false
        },

        /* -------- 2. ACTIVITY PROGRESSION (NEW 2025-2026) -------- */
        {
            id:      "account_age_1yr",
            name:    "Account Age (1 năm)",
            type:    "fa",
            icon:    "fa-solid fa-cake-candles",
            color:   "#a78bfa",
            tooltip: "Account Anniversary — tài khoản Discord tròn 1 tuổi (mở khoá vào kỷ niệm 1 năm)",
            enabled: false
        },
        {
            id:      "account_age_5yr",
            name:    "Account Age (5 năm)",
            type:    "fa",
            icon:    "fa-solid fa-star",
            color:   "#f59e0b",
            tooltip: "Account Anniversary — tài khoản Discord tròn 5 tuổi",
            enabled: false
        },
        {
            id:      "account_age_10yr",
            name:    "Account Age (10 năm – Max)",
            type:    "fa",
            icon:    "fa-solid fa-trophy",
            color:   "#fbbf24",
            tooltip: "Account Anniversary — tài khoản Discord tròn 10 tuổi — mức tối đa!",
            enabled: false
        },
        {
            id:      "game_time",
            name:    "Game Time Tracker",
            type:    "fa",
            icon:    "fa-solid fa-gamepad",
            color:   "#22d3ee",
            tooltip: "Game Time Progression — theo dõi tổng giờ chơi game được Discord phát hiện (tối đa 5.000 giờ)",
            enabled: false
        },
        {
            id:      "game_variety",
            name:    "Game Variety Tracker",
            type:    "fa",
            icon:    "fa-solid fa-dice",
            color:   "#34d399",
            tooltip: "Game Variety Progression — theo dõi số lượng game khác nhau đã chơi (tối đa 100 game)",
            enabled: false
        },
        {
            id:      "streaming_tracker",
            name:    "Streaming Tracker",
            type:    "fa",
            icon:    "fa-solid fa-tower-broadcast",
            color:   "#f472b6",
            tooltip: "Streaming Progression — theo dõi tổng giờ stream video/audio trong voice channel (tối đa 5.000 giờ)",
            enabled: false
        },

        /* -------- 3. RARE & SPECIAL -------- */
        {
            id:      "discord_employee",
            name:    "Discord Staff",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-stuff-badge.png",
            color:   "#5865f2",
            tooltip: "Discord Staff — nhân viên chính thức của Discord (chỉ nhân viên Discord mới có)",
            enabled: false
        },
        {
            id:      "bug_hunter_level_1",
            name:    "Bug Hunter (Silver)",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-bug-hunter-badge.png",
            color:   "#f47b67",
            tooltip: "Bug Hunter Silver — tìm và báo cáo bug tích cực cho Discord",
            enabled: true
        },
        {
            id:      "bug_hunter_level_2",
            name:    "Bug Hunter (Gold)",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-golden-bug-hunter-badge.png",
            color:   "#f0b132",
            tooltip: "Bug Hunter Gold — elite tier cho bug hunter xuất sắc và tích cực nhất",
            enabled: false
        },

        /* -------- 4. LEGACY & UNOBTAINABLE -------- */
        {
            id:      "hypesquad_online_house_1",
            name:    "HypeSquad Bravery",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-hypesquad-bravery-house-badge.png",
            color:   "#9c5ee6",
            tooltip: "HypeSquad Bravery [Legacy] — bị xoá khỏi Discord tháng 5/2026. Dũng cảm & quyết đoán.",
            enabled: true
        },
        {
            id:      "hypesquad_online_house_2",
            name:    "HypeSquad Brilliance",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/dsicord-hypesquad-brilliance-house-badge.png",
            color:   "#f47c6f",
            tooltip: "HypeSquad Brilliance [Legacy] — bị xoá khỏi Discord tháng 5/2026. Sáng tạo & nhiệt huyết.",
            enabled: false
        },
        {
            id:      "hypesquad_online_house_3",
            name:    "HypeSquad Balance",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-hypesquad-balance-house-badge.png",
            color:   "#45d791",
            tooltip: "HypeSquad Balance [Legacy] — bị xoá khỏi Discord tháng 5/2026. Linh hoạt & cân bằng.",
            enabled: false
        },
        {
            id:      "hypesquad",
            name:    "HypeSquad Events",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-hypesquad-events-badge.png",
            color:   "#f4a533",
            tooltip: "HypeSquad Events [Legacy] — đại diện Discord tại các sự kiện thực tế & gaming conventions",
            enabled: false
        },
        {
            id:      "early_supporter",
            name:    "Early Supporter",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-early-supporter-badge.png",
            color:   "#6e56d6",
            tooltip: "Early Supporter [Legacy] — mua Nitro trước tháng 10/2018. Cống hiến cho Discord từ đầu.",
            enabled: true
        },
        {
            id:      "partner",
            name:    "Partnered Server Owner",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-partner-server-owner-badge.png",
            color:   "#5865f2",
            tooltip: "Partnered Server Owner [Legacy] — chủ server cộng đồng lớn được Discord xác thực chính thức",
            enabled: false
        },
        {
            id:      "verified_developer",
            name:    "Early Verified Bot Dev",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-early-verified-bot-developer-badge.png",
            color:   "#5865f2",
            tooltip: "Early Verified Bot Developer [Legacy] — xác minh ứng dụng bot trước tháng 8/2020",
            enabled: true
        },
        {
            id:      "active_developer",
            name:    "Active Developer",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-active-developer-badge.png",
            color:   "#5865f2",
            tooltip: "Active Developer — thành viên chương trình Active Developer của Discord",
            enabled: true
        },
        {
            id:      "certified_moderator",
            name:    "Moderator Alumni",
            type:    "img",
            icon:    "https://img.icons8.com/fluency/48/discord-moderator-program-alumni-badge.png",
            color:   "#45d791",
            tooltip: "Moderator Programs Alumni [Legacy] — hoàn thành Discord Moderator Academy (nay đã bị khai tử)",
            enabled: false
        },
        {
            id:      "legacy_username",
            name:    "Legacy Username",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/legacy_username.png",
            color:   "#94a3b8",
            tooltip: "Legacy Username [Legacy] — hiển thị username gốc (discriminator) trước khi đổi sang hệ thống unique username",
            enabled: false
        },
        {
            id:      "last_meadow",
            name:    "Last Meadow Online",
            type:    "fa",
            icon:    "fa-solid fa-clover",
            color:   "#4ade80",
            tooltip: "Last Meadow Online [Unique Event Badge] — badge giới hạn từ sự kiện April Fools đặc biệt của Discord",
            enabled: false
        }
    ],

    /* ============================================================
       Social Links
       ============================================================ */
    socials: [
        {
            id:    "discord",
            name:  "Discord",
            label: "Discord",
            icon:  "fa-brands fa-discord",
            url:   "https://discord.com/users/1129745140745498694",
            color: "#5865f2"
        },
        {
            id:    "github",
            name:  "GitHub",
            label: "GitHub",
            icon:  "fa-brands fa-github",
            url:   "https://github.com/anklabo29ms",
            color: "#e0e0e0"
        },
        {
            id:    "youtube",
            name:  "YouTube",
            label: "YouTube",
            icon:  "fa-brands fa-youtube",
            url:   "https://youtube.com",
            color: "#ff0000"
        },
        {
            id:    "spotify",
            name:  "Spotify",
            label: "Spotify",
            icon:  "fa-brands fa-spotify",
            url:   "https://open.spotify.com",
            color: "#1db954"
        }
    ],

    /* ============================================================
       Music Playlist
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
                artist: "Khởi My ft. K-ICM",
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
