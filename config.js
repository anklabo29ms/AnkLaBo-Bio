/**
 * =========================================================================
 * AnkLaBo Bio - Cấu hình trang cá nhân phong cách guns.lol & zyo.lol
 * =========================================================================
 */

const CONFIG = {
    // ---------------------------------------------------------------------
    // 1. BẢO MẬT & XÁC THỰC (Mã băm SHA-256 Salted, tuyệt đối không lộ plain text)
    // ---------------------------------------------------------------------
    auth: {
        salt: "anklabo_bio_salt_2026",
        passwordHash: "7a26c5442691e4de63bfdc6bda28f13d18de88dea4aabb3d110436f39d9c1df3"
    },

    // ---------------------------------------------------------------------
    // 2. DISCORD SYNC (Lanyard API qua User ID - Không cần OAuth2)
    // ---------------------------------------------------------------------
    discord: {
        userId: "102527670",       // Discord User ID của bạn
        autoSyncProfile: true,     // Tự động dùng avatar và banner Discord
        showPresence: true         // Hiển thị thanh Spotify / Game trực tiếp
    },

    // ---------------------------------------------------------------------
    // 3. THÔNG TIN HỒ SƠ (PROFILE)
    // ---------------------------------------------------------------------
    profile: {
        username: "AnkLaBo",
        handle: "anklabo29ms",
        uid: "1",
        avatar: "https://avatars.githubusercontent.com/u/102527670?v=4",
        banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        bioQuotes: [
            "Full-stack Developer & Tech Enthusiast",
            "Living in the digital cyber world",
            "discord.gg / anklabo",
            "Coding the impossible ⚡"
        ],
        location: "Vietnam 🇻🇳",
        viewsInitial: 1337
    },

    // ---------------------------------------------------------------------
    // 4. TRỌN BỘ HUY HIỆU DISCORD & CUSTOM BADGES (Đầy đủ 100%)
    // ---------------------------------------------------------------------
    badges: [
        {
            id: "verified",
            name: "Verified Tick",
            category: "custom",
            icon: "fa-solid fa-circle-check",
            color: "#38bdf8",
            tooltip: "Xác minh chính chủ AnkLaBo",
            enabled: true
        },
        {
            id: "owner",
            name: "Owner #0001",
            category: "custom",
            icon: "fa-solid fa-crown",
            color: "#f59e0b",
            tooltip: "Chủ sở hữu Bio (#0001)",
            enabled: true
        },
        {
            id: "nitro",
            name: "Discord Nitro",
            category: "discord",
            icon: "fa-solid fa-bolt",
            color: "#ec4899",
            tooltip: "Discord Nitro Subscriber",
            enabled: true
        },
        {
            id: "booster",
            name: "Server Booster",
            category: "discord",
            icon: "fa-solid fa-rocket",
            color: "#f472b6",
            tooltip: "Discord Server Booster Level 3",
            enabled: true
        },
        {
            id: "active_dev",
            name: "Active Developer",
            category: "discord",
            icon: "fa-solid fa-terminal",
            color: "#57F287",
            tooltip: "Discord Active Developer",
            enabled: true
        },
        {
            id: "early_dev",
            name: "Early Verified Bot Developer",
            category: "discord",
            icon: "fa-solid fa-code",
            color: "#5865F2",
            tooltip: "Early Verified Bot Developer",
            enabled: true
        },
        {
            id: "early_supporter",
            name: "Early Supporter",
            category: "discord",
            icon: "fa-solid fa-gem",
            color: "#EB459E",
            tooltip: "Discord Early Supporter",
            enabled: true
        },
        {
            id: "bravery",
            name: "HypeSquad Bravery",
            category: "discord",
            icon: "fa-solid fa-shield-halved",
            color: "#9B59B6",
            tooltip: "HypeSquad Bravery House",
            enabled: true
        },
        {
            id: "brilliance",
            name: "HypeSquad Brilliance",
            category: "discord",
            icon: "fa-solid fa-certificate",
            color: "#E67E22",
            tooltip: "HypeSquad Brilliance House",
            enabled: false
        },
        {
            id: "balance",
            name: "HypeSquad Balance",
            category: "discord",
            icon: "fa-solid fa-scale-balanced",
            color: "#2ECC71",
            tooltip: "HypeSquad Balance House",
            enabled: false
        },
        {
            id: "bug_hunter_1",
            name: "Bug Hunter 1",
            category: "discord",
            icon: "fa-solid fa-bug",
            color: "#57F287",
            tooltip: "Discord Bug Hunter Level 1",
            enabled: false
        },
        {
            id: "bug_hunter_2",
            name: "Bug Hunter 2",
            category: "discord",
            icon: "fa-solid fa-shield-virus",
            color: "#FEE75C",
            tooltip: "Discord Bug Hunter Level 2",
            enabled: false
        },
        {
            id: "staff",
            name: "Discord Staff",
            category: "discord",
            icon: "fa-solid fa-shield",
            color: "#5865F2",
            tooltip: "Discord Employee / Staff",
            enabled: false
        },
        {
            id: "partner",
            name: "Partnered Server Owner",
            category: "discord",
            icon: "fa-solid fa-handshake",
            color: "#5865F2",
            tooltip: "Partnered Server Owner",
            enabled: false
        },
        {
            id: "moderator",
            name: "Certified Moderator",
            category: "discord",
            icon: "fa-solid fa-award",
            color: "#5865F2",
            tooltip: "Discord Certified Moderator Alumni",
            enabled: false
        },
        {
            id: "quest",
            name: "Quest Completed",
            category: "discord",
            icon: "fa-solid fa-compass",
            color: "#a855f7",
            tooltip: "Discord Quest Completionist",
            enabled: true
        }
    ],

    // ---------------------------------------------------------------------
    // 5. LIÊN KẾT MẠNG XÃ HỘI (SOCIAL LINKS)
    // ---------------------------------------------------------------------
    socials: [
        {
            id: "discord",
            name: "Discord",
            icon: "fa-brands fa-discord",
            url: "https://discord.com/users/102527670",
            color: "#5865F2",
            tooltip: "Discord Profile"
        },
        {
            id: "github",
            name: "GitHub",
            icon: "fa-brands fa-github",
            url: "https://github.com/anklabo29ms",
            color: "#ffffff",
            tooltip: "github.com/anklabo29ms"
        },
        {
            id: "telegram",
            name: "Telegram",
            icon: "fa-brands fa-telegram",
            url: "https://t.me/anklabo",
            color: "#229ED9",
            tooltip: "Telegram Contact"
        },
        {
            id: "steam",
            name: "Steam",
            icon: "fa-brands fa-steam",
            url: "https://steamcommunity.com/",
            color: "#1b2838",
            tooltip: "Steam Profile"
        },
        {
            id: "spotify",
            name: "Spotify",
            icon: "fa-brands fa-spotify",
            url: "https://spotify.com",
            color: "#1DB954",
            tooltip: "My Spotify Playlist"
        },
        {
            id: "facebook",
            name: "Facebook",
            icon: "fa-brands fa-facebook",
            url: "https://facebook.com",
            color: "#1877F2",
            tooltip: "Facebook Profile"
        }
    ],

    // ---------------------------------------------------------------------
    // 6. PLAYLIST ÂM NHẠC (Lo-Fi / Remix Việt Nam & Hỗ trợ Link YouTube)
    // ---------------------------------------------------------------------
    music: {
        volume: 0.5,
        autoplayOnEnter: true,
        currentTrackIndex: 0,
        playlist: [
            {
                title: "2 Phút Hơn (KAIZ Remix)",
                artist: "Pháo x KAIZ (Vietnam Aesthetic)",
                cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
                src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-2099-10701.mp3",
                type: "direct" // hoặc "youtube"
            },
            {
                title: "Dạ Vũ (Lo-Fi Chill Beat)",
                artist: "Tăng Duy Tân (Lo-Fi Version)",
                cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
                src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3",
                type: "direct"
            },
            {
                title: "Cắt Đôi Nỗi Sầu (Ambient Lo-Fi)",
                artist: "Vietnam Chill Beats",
                cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
                src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-chill-medium-version-159456.mp3",
                type: "direct"
            },
            {
                title: "Cyberpunk 2099",
                artist: "Synthwave / Phonk Beats",
                cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop",
                src: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_0576326ff1.mp3?filename=cyber-war-126419.mp3",
                type: "direct"
            }
        ]
    },

    // ---------------------------------------------------------------------
    // 7. BỘ HIỆU ỨNG & GIAO DIỆN SÂU (guns.lol & zyo.lol)
    // ---------------------------------------------------------------------
    theme: {
        accentColor: "#8b5cf6",
        glowColor: "rgba(139, 92, 246, 0.45)",
        // Chế độ nền: "starfield", "matrix", "snow", "embers", "image", "video"
        backgroundMode: "starfield",
        backgroundImageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop",
        backgroundVideoUrl: "",
        // Hiệu ứng viền Avatar: "rainbow" (RGB xoay), "glow" (thở neon), "glitch", "static"
        avatarEffect: "rainbow",
        // Hiệu ứng chữ Username: "gradient", "rainbow", "neon"
        usernameEffect: "gradient",
        // Hiệu ứng màn hình Retro
        scanlines: true,        // Dải quét CRT cổ điển
        clickSound: true,       // Âm thanh cơ học khi click
        customCursor: true,     // Con trỏ neon custom
        sparkleTrail: true      // Vệt sáng lấp lánh
    }
};

if (typeof window !== "undefined") {
    window.CONFIG = CONFIG;
}
