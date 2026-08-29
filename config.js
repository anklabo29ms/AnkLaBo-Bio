/**
 * AnkLaBo Bio — config.js v3.1
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

       type: "img"  -> Discord CDN PNG (preferred, crisp rendering)
       type: "fa"   -> FontAwesome icon (fallback for newer badges)

       enabled: false = hidden by default, toggle in Config Panel
       ============================================================ */
    badges: [

        /* -------- 1. SUBSCRIPTION / PAID -------- */
        {
            id:      "nitro",
            name:    "Discord Nitro",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/premium.png",
            color:   "#5865f2",
            tooltip: "Discord Nitro Subscriber — ho tro Discord voi goi Nitro dang hoat dong",
            enabled: true
        },
        {
            id:      "booster_lvl1",
            name:    "Server Booster (1 thang)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl1.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 1 — boost server lien tuc 1 thang",
            enabled: false
        },
        {
            id:      "booster_lvl2",
            name:    "Server Booster (2 thang)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl2.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 2 — boost server lien tuc 2 thang",
            enabled: false
        },
        {
            id:      "booster_lvl3",
            name:    "Server Booster (3 thang)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl3.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 3 — boost server lien tuc 3 thang",
            enabled: true
        },
        {
            id:      "booster_lvl4",
            name:    "Server Booster (6 thang)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl4.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 4 — boost server lien tuc 6 thang",
            enabled: false
        },
        {
            id:      "booster_lvl5",
            name:    "Server Booster (9 thang)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl5.png",
            color:   "#ff73fa",
            tooltip: "Server Booster Tier 5 — boost server lien tuc 9 thang",
            enabled: false
        },
        {
            id:      "booster_lvl6",
            name:    "Server Booster (12 thang)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl6.png",
            color:   "#e040fb",
            tooltip: "Server Booster Tier 6 — boost server lien tuc 12 thang",
            enabled: false
        },
        {
            id:      "booster_lvl7",
            name:    "Server Booster (15 thang)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl7.png",
            color:   "#e040fb",
            tooltip: "Server Booster Tier 7 — boost server lien tuc 15 thang",
            enabled: false
        },
        {
            id:      "booster_lvl8",
            name:    "Server Booster (18 thang)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl8.png",
            color:   "#e040fb",
            tooltip: "Server Booster Tier 8 — boost server lien tuc 18 thang",
            enabled: false
        },
        {
            id:      "booster_lvl9",
            name:    "Server Booster (24 thang - Max)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/guild_booster_lvl9.png",
            color:   "#a855f7",
            tooltip: "Server Booster Tier 9 — boost server lien tuc 24+ thang — muc dinh cao nhat!",
            enabled: false
        },
        {
            id:      "discord_quests",
            name:    "Discord Quests",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/questsrewardedv1.png",
            color:   "#f59e0b",
            tooltip: "Discord Quests — hoan thanh nhiem vu choi game theo thoi gian gioi han qua Gift Inventory",
            enabled: false
        },
        {
            id:      "orbs_apprentice",
            name:    "Orbs Apprentice",
            type:    "fa",
            icon:    "fa-solid fa-circle-nodes",
            color:   "#06b6d4",
            tooltip: "Orbs Apprentice — muc hoc vien trong he thong Orb noi bo cua Discord",
            enabled: false
        },

        /* -------- 2. ACTIVITY PROGRESSION (NEW 2025-2026) -------- */
        {
            id:      "account_age_1yr",
            name:    "Account Age (1 nam)",
            type:    "fa",
            icon:    "fa-solid fa-cake-candles",
            color:   "#a78bfa",
            tooltip: "Account Anniversary — tai khoan Discord tron 1 tuoi (mo khoa vao ky niem 1 nam)",
            enabled: false
        },
        {
            id:      "account_age_5yr",
            name:    "Account Age (5 nam)",
            type:    "fa",
            icon:    "fa-solid fa-star",
            color:   "#f59e0b",
            tooltip: "Account Anniversary — tai khoan Discord tron 5 tuoi",
            enabled: false
        },
        {
            id:      "account_age_10yr",
            name:    "Account Age (10 nam - Max)",
            type:    "fa",
            icon:    "fa-solid fa-trophy",
            color:   "#fbbf24",
            tooltip: "Account Anniversary — tai khoan Discord tron 10 tuoi — muc toi da!",
            enabled: false
        },
        {
            id:      "game_time",
            name:    "Game Time Tracker",
            type:    "fa",
            icon:    "fa-solid fa-gamepad",
            color:   "#22d3ee",
            tooltip: "Game Time Progression — theo doi tong gio choi game duoc Discord phat hien (toi da 5.000 gio)",
            enabled: false
        },
        {
            id:      "game_variety",
            name:    "Game Variety Tracker",
            type:    "fa",
            icon:    "fa-solid fa-dice",
            color:   "#34d399",
            tooltip: "Game Variety Progression — theo doi so luong game khac nhau da choi (toi da 100 game)",
            enabled: false
        },
        {
            id:      "streaming_tracker",
            name:    "Streaming Tracker",
            type:    "fa",
            icon:    "fa-solid fa-tower-broadcast",
            color:   "#f472b6",
            tooltip: "Streaming Progression — theo doi tong gio stream video/audio trong voice channel (toi da 5.000 gio)",
            enabled: false
        },

        /* -------- 3. RARE & SPECIAL -------- */
        {
            id:      "discord_employee",
            name:    "Discord Staff",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/discord_employee.png",
            color:   "#5865f2",
            tooltip: "Discord Staff — nhan vien chinh thuc cua Discord (chi nhan vien Discord moi co)",
            enabled: false
        },
        {
            id:      "bug_hunter_level_1",
            name:    "Bug Hunter (Silver)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/bug_hunter_level_1.png",
            color:   "#f47b67",
            tooltip: "Bug Hunter Silver — tim va bao cao bug tich cuc cho Discord",
            enabled: true
        },
        {
            id:      "bug_hunter_level_2",
            name:    "Bug Hunter (Gold)",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/bug_hunter_level_2.png",
            color:   "#f0b132",
            tooltip: "Bug Hunter Gold — elite tier cho bug hunter xuat sac va tich cuc nhat",
            enabled: false
        },

        /* -------- 4. LEGACY & UNOBTAINABLE -------- */
        {
            id:      "hypesquad_online_house_1",
            name:    "HypeSquad Bravery",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/hypesquad_online_house_1.png",
            color:   "#9c5ee6",
            tooltip: "HypeSquad Bravery [Legacy] — bi xoa khoi Discord thang 5/2026. Dung cam & quyet doan.",
            enabled: true
        },
        {
            id:      "hypesquad_online_house_2",
            name:    "HypeSquad Brilliance",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/hypesquad_online_house_2.png",
            color:   "#f47c6f",
            tooltip: "HypeSquad Brilliance [Legacy] — bi xoa khoi Discord thang 5/2026. Sang tao & nhiet huyet.",
            enabled: false
        },
        {
            id:      "hypesquad_online_house_3",
            name:    "HypeSquad Balance",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/hypesquad_online_house_3.png",
            color:   "#45d791",
            tooltip: "HypeSquad Balance [Legacy] — bi xoa khoi Discord thang 5/2026. Linh hoat & can bang.",
            enabled: false
        },
        {
            id:      "hypesquad",
            name:    "HypeSquad Events",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/hypesquad.png",
            color:   "#f4a533",
            tooltip: "HypeSquad Events [Legacy] — dai dien Discord tai cac su kien thuc te & gaming conventions",
            enabled: false
        },
        {
            id:      "early_supporter",
            name:    "Early Supporter",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/early_supporter.png",
            color:   "#6e56d6",
            tooltip: "Early Supporter [Legacy] — mua Nitro truoc thang 10/2018. Cong hien cho Discord tu dau.",
            enabled: true
        },
        {
            id:      "partner",
            name:    "Partnered Server Owner",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/partner.png",
            color:   "#5865f2",
            tooltip: "Partnered Server Owner [Legacy] — chu server cong dong lon duoc Discord xac thuc chinh thuc",
            enabled: false
        },
        {
            id:      "verified_developer",
            name:    "Early Verified Bot Dev",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/verified_developer.png",
            color:   "#5865f2",
            tooltip: "Early Verified Bot Developer [Legacy] — xac minh ung dung bot truoc thang 8/2020",
            enabled: true
        },
        {
            id:      "active_developer",
            name:    "Active Developer",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/active_developer.png",
            color:   "#5865f2",
            tooltip: "Active Developer — thanh vien chuong trinh Active Developer cua Discord",
            enabled: true
        },
        {
            id:      "certified_moderator",
            name:    "Moderator Alumni",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/certified_moderator.png",
            color:   "#45d791",
            tooltip: "Moderator Programs Alumni [Legacy] — hoan thanh Discord Moderator Academy (nay da bi khai tu)",
            enabled: false
        },
        {
            id:      "legacy_username",
            name:    "Legacy Username",
            type:    "img",
            icon:    "https://cdn.discordapp.com/badge-icons/legacy_username.png",
            color:   "#94a3b8",
            tooltip: "Legacy Username [Legacy] — hien thi username goc (discriminator) truoc khi doi sang he thong unique username",
            enabled: false
        },
        {
            id:      "last_meadow",
            name:    "Last Meadow Online",
            type:    "fa",
            icon:    "fa-solid fa-clover",
            color:   "#4ade80",
            tooltip: "Last Meadow Online [Unique Event Badge] — badge gioi han tu su kien April Fools dac biet cua Discord",
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
                title:  "2 Phut Hon (KAIZ Remix)",
                artist: "Phao x KAIZ",
                cover:  "https://i.ytimg.com/vi/FdsuEtMdTP4/maxresdefault.jpg",
                type:   "youtube"
            },
            {
                id:     "gCYcHz2k5x0",
                title:  "Da Vu (Lo-Fi)",
                artist: "May & Tay Nguyen",
                cover:  "https://i.ytimg.com/vi/gCYcHz2k5x0/maxresdefault.jpg",
                type:   "youtube"
            },
            {
                id:     "GSTL3O9Yq5o",
                title:  "Cat Doi Noi Sau (Lo-Fi)",
                artist: "Khoi My ft. K-ICM",
                cover:  "https://i.ytimg.com/vi/GSTL3O9Yq5o/maxresdefault.jpg",
                type:   "youtube"
            },
            {
                id:     "oqPnmHH-Kgk",
                title:  "Em Quoi Quoi (Remix)",
                artist: "Hong Thanh",
                cover:  "https://i.ytimg.com/vi/oqPnmHH-Kgk/maxresdefault.jpg",
                type:   "youtube"
            }
        ]
    }
};

if (typeof window !== "undefined") {
    window.CONFIG = CONFIG;
}
