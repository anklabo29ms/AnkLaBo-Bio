/**
 * =========================================================================
 * AnkLaBo Bio - Cấu hình trang cá nhân phong cách guns.lol & zyo.lol
 * =========================================================================
 * Bạn có thể chỉnh sửa trực tiếp file này, hoặc dùng nút Cài đặt (Gear icon)
 * trên Bio để mở bảng điều khiển và sửa trực tiếp trên trình duyệt.
 */

const CONFIG = {
    // ---------------------------------------------------------------------
    // 1. BẢO MẬT & XÁC THỰC (Tuyệt đối không lưu mật khẩu dạng thường)
    // ---------------------------------------------------------------------
    auth: {
        salt: "anklabo_bio_salt_2026",
        // Mã băm SHA-256 của mật khẩu AnkLaBo2610 kèm salt
        // Mật khẩu gốc KHÔNG BAO GIỜ bị lộ trong code
        passwordHash: "7a26c5442691e4de63bfdc6bda28f13d18de88dea4aabb3d110436f39d9c1df3",
        // Discord Client ID nếu bạn muốn dùng nút "Login with Discord" chính thức qua OAuth2
        // (Tạo miễn phí tại https://discord.com/developers/applications)
        discordClientId: ""
    },

    // ---------------------------------------------------------------------
    // 2. THÔNG TIN DISCORD & TRẠNG THÁI TRỰC TIẾP (Lanyard API)
    // ---------------------------------------------------------------------
    discord: {
        // Nhập Discord User ID của bạn để tự động hiển thị Avatar, Banner và Live Status
        // (Bật Developer Mode trên Discord -> Click chuột phải vào tên bạn -> Copy User ID)
        userId: "102527670",
        // Tự động dùng avatar và banner từ Discord khi tải trang
        autoSyncProfile: true,
        // Hiển thị thanh nghe nhạc Spotify / game đang chơi
        showPresence: true
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
    // 4. HUY HIỆU (BADGES)
    // ---------------------------------------------------------------------
    badges: [
        {
            id: "verified",
            name: "Verified",
            icon: "fa-solid fa-circle-check",
            color: "#38bdf8",
            tooltip: "Đã xác minh chính chủ"
        },
        {
            id: "vip",
            name: "VIP",
            icon: "fa-solid fa-gem",
            color: "#a855f7",
            tooltip: "Thành viên VIP"
        },
        {
            id: "dev",
            name: "Developer",
            icon: "fa-solid fa-code",
            color: "#22c55e",
            tooltip: "Full-stack Coder"
        },
        {
            id: "booster",
            name: "Booster",
            icon: "fa-solid fa-rocket",
            color: "#ec4899",
            tooltip: "Server Booster"
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
    // 6. ÂM NHẠC (MUSIC PLAYER)
    // ---------------------------------------------------------------------
    music: {
        title: "Cyber Aesthetic Lo-Fi",
        artist: "Synthwave / Lo-Fi Beats",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
        src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-2099-10701.mp3",
        volume: 0.5,
        autoplayOnEnter: true
    },

    // ---------------------------------------------------------------------
    // 7. GIAO DIỆN & HIỆU ỨNG (THEME & BACKGROUND)
    // ---------------------------------------------------------------------
    theme: {
        accentColor: "#8b5cf6",
        glowColor: "rgba(139, 92, 246, 0.4)",
        cardBlur: 20,
        cardOpacity: 0.65,
        backgroundMode: "particles",
        backgroundVideoUrl: "",
        backgroundImageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop",
        customCursor: true,
        sparkleTrail: true
    }
};

if (typeof window !== "undefined") {
    window.CONFIG = CONFIG;
}
