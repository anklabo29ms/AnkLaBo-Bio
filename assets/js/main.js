/**
 * Main Controller for AnkLaBo Bio
 * Điều khiển Màn hình Enter, Badge Tooltip Bar, View Counter thật, Typewriter, Tilt & Effects
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Tải cấu hình đã lưu nếu có
    const savedConfig = localStorage.getItem("anklabo_bio_custom_config");
    if (savedConfig) {
        try {
            window.CONFIG = Object.assign({}, window.CONFIG, JSON.parse(savedConfig));
        } catch (e) {}
    }

    // 2. Khởi tạo các module
    const effectsEngine = new window.EffectsEngine();
    const auth = new window.BioAuth(window.CONFIG);
    const musicPlayer = new window.MusicPlayer(window.CONFIG);
    
    // Discord Manager (Lanyard User ID sync)
    const discordManager = new window.DiscordManager(
        window.CONFIG,
        (profileUpdate) => handleDiscordProfileUpdate(profileUpdate),
        (presenceUpdate) => handleDiscordPresenceUpdate(presenceUpdate)
    );

    // Config Panel
    const configPanel = new window.ConfigPanel(auth, discordManager, musicPlayer, effectsEngine);

    // 3. Render giao diện Bio
    renderBioProfile(window.CONFIG);

    // 4. Kích hoạt hiệu ứng nền đã chọn
    if (effectsEngine && window.CONFIG.theme && window.CONFIG.theme.backgroundMode) {
        effectsEngine.setEffect(window.CONFIG.theme.backgroundMode);
        effectsEngine.toggleScanlines(window.CONFIG.theme.scanlines !== false);
    }

    // 5. Màn hình chờ "Click to enter"
    initEnterScreen(musicPlayer, effectsEngine);

    // 6. Hiệu ứng gõ chữ (Typewriter)
    initTypewriter(window.CONFIG.profile.bioQuotes);

    // 7. Hiệu ứng nghiêng 3D (Parallax Card Tilt)
    initCardTilt();

    // 8. Con trỏ chuột neon & Sparkle Trail
    initCustomCursor();

    // 9. Bộ đếm lượt xem THẬT (Real Server View Counter)
    initRealViewCounter();

    // 10. Gán âm thanh click UI
    initClickSounds(effectsEngine);
});

/**
 * Render toàn bộ thông tin Bio từ CONFIG
 */
function renderBioProfile(config) {
    if (!config) return;

    // Màu chủ đạo
    if (config.theme && config.theme.accentColor) {
        document.documentElement.style.setProperty("--accent", config.theme.accentColor);
        document.documentElement.style.setProperty("--accent-glow", config.theme.glowColor || "rgba(139, 92, 246, 0.45)");
    }

    // Banner & Avatar
    const bannerEl = document.getElementById("profile-banner");
    if (bannerEl) {
        if (config.profile.banner) {
            bannerEl.style.backgroundImage = `url('${config.profile.banner}')`;
            bannerEl.style.display = "block";
        } else {
            bannerEl.style.display = "none";
        }
    }

    const avatarEl = document.getElementById("profile-avatar-img");
    if (avatarEl && config.profile.avatar) {
        avatarEl.src = config.profile.avatar;
    }

    // Hiệu ứng viền Avatar
    const avatarRing = document.getElementById("profile-avatar-ring");
    if (avatarRing && config.theme) {
        avatarRing.className = `avatar-ring ${config.theme.avatarEffect || "rainbow"}`;
    }

    // Tên & Handle & UID
    const nameEl = document.getElementById("profile-name");
    if (nameEl) {
        nameEl.textContent = config.profile.username || "AnkLaBo";
        nameEl.className = `username ${config.theme.usernameEffect || "gradient"}`;
    }

    const handleEl = document.getElementById("profile-handle");
    if (handleEl) handleEl.textContent = `@${config.profile.handle || "anklabo29ms"}`;

    const uidEl = document.getElementById("profile-uid");
    if (uidEl) uidEl.textContent = `UID: ${config.profile.uid || "1"}`;

    const locationEl = document.getElementById("profile-location");
    if (locationEl) {
        locationEl.textContent = config.profile.location || "Vietnam";
    }

    // Render Badges & Gắn tương tác thông minh cho Tooltip Bar
    renderBadgesWithSmartTooltip(config.badges || []);

    // Social Links
    const socialsContainer = document.getElementById("profile-socials");
    if (socialsContainer) {
        socialsContainer.innerHTML = "";
        const socials = config.socials || [];
        socials.forEach(item => {
            const a = document.createElement("a");
            a.className = "social-btn";
            a.href = item.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.setAttribute("data-tooltip", item.tooltip || item.name);
            a.style.setProperty("--hover-color", item.color || "#fff");
            a.innerHTML = `<i class="${item.icon}"></i>`;
            socialsContainer.appendChild(a);
        });
    }

    // Background Image
    const bgImageEl = document.getElementById("bg-image-layer");
    if (bgImageEl && config.theme.backgroundImageUrl) {
        bgImageEl.style.backgroundImage = `url('${config.theme.backgroundImageUrl}')`;
    }
}
window.renderBioProfile = renderBioProfile;

/**
 * Render Badges và xử lý thanh chú thích thông minh không bị che bởi Avatar
 */
function renderBadgesWithSmartTooltip(badges) {
    const badgesContainer = document.getElementById("profile-badges");
    const tooltipBar = document.getElementById("badge-tooltip-bar");
    if (!badgesContainer || !tooltipBar) return;

    badgesContainer.innerHTML = "";
    const activeBadges = badges.filter(b => b.enabled !== false);

    activeBadges.forEach((badge, index) => {
        const badgeEl = document.createElement("div");
        badgeEl.className = "bio-badge";
        badgeEl.setAttribute("data-index", index);
        badgeEl.innerHTML = `<i class="${badge.icon}" style="color: ${badge.color}"></i>`;

        // Sự kiện chuột trên Desktop
        badgeEl.addEventListener("mouseenter", () => showBadgeTooltip(badge, badgeEl));
        badgeEl.addEventListener("mouseleave", () => hideBadgeTooltip());

        // Sự kiện chạm trên Mobile
        badgeEl.addEventListener("click", (e) => {
            e.stopPropagation();
            showBadgeTooltip(badge, badgeEl);
        });

        badgesContainer.appendChild(badgeEl);
    });

    // Chạm ra ngoài thì ẩn tooltip
    document.addEventListener("click", () => hideBadgeTooltip());
}

let tooltipTimeout = null;
function showBadgeTooltip(badge, badgeEl) {
    const tooltipBar = document.getElementById("badge-tooltip-bar");
    if (!tooltipBar) return;

    if (tooltipTimeout) clearTimeout(tooltipTimeout);

    // Bỏ active cũ
    document.querySelectorAll(".bio-badge").forEach(b => b.classList.remove("active-badge"));
    badgeEl.classList.add("active-badge");

    tooltipBar.innerHTML = `
        <div class="tooltip-bar-content">
            <span class="tooltip-icon"><i class="${badge.icon}" style="color: ${badge.color}"></i></span>
            <span class="tooltip-title">${badge.name}</span>
            <span class="tooltip-sep">•</span>
            <span class="tooltip-desc">${badge.tooltip || badge.name}</span>
        </div>
    `;
    tooltipBar.classList.add("visible");
}

function hideBadgeTooltip() {
    const tooltipBar = document.getElementById("badge-tooltip-bar");
    if (!tooltipBar) return;

    tooltipTimeout = setTimeout(() => {
        tooltipBar.classList.remove("visible");
        document.querySelectorAll(".bio-badge").forEach(b => b.classList.remove("active-badge"));
    }, 200);
}

/**
 * Xử lý cập nhật Discord Profile
 */
function handleDiscordProfileUpdate(profile) {
    if (!profile) return;
    if (profile.avatar) {
        const avatarEl = document.getElementById("profile-avatar-img");
        if (avatarEl) avatarEl.src = profile.avatar;
    }
    if (profile.banner) {
        const bannerEl = document.getElementById("profile-banner");
        if (bannerEl) {
            bannerEl.style.backgroundImage = `url('${profile.banner}')`;
            bannerEl.style.display = "block";
        }
    }
    if (profile.username) {
        const nameEl = document.getElementById("profile-name");
        if (nameEl) nameEl.textContent = profile.username;
    }
}

/**
 * Xử lý cập nhật Discord Presence (Spotify / Game)
 */
function handleDiscordPresenceUpdate(presence) {
    if (!presence) return;

    const statusDot = document.getElementById("profile-status-dot");
    if (statusDot) {
        statusDot.className = `status-dot ${presence.status}`;
        const statusNames = {
            online: "Trực tuyến",
            idle: "Vắng mặt",
            dnd: "Đừng làm phiền",
            offline: "Ngoại tuyến"
        };
        statusDot.setAttribute("data-tooltip", statusNames[presence.status] || presence.status);
    }

    const presenceBox = document.getElementById("discord-presence-box");
    if (!presenceBox) return;

    if (presence.spotify) {
        presenceBox.style.display = "flex";
        presenceBox.className = "discord-presence-box spotify-active";
        presenceBox.innerHTML = `
            <div class="presence-icon"><i class="fa-brands fa-spotify"></i></div>
            <img src="${presence.spotify.albumArtUrl}" class="presence-art" alt="Spotify Art" />
            <div class="presence-info">
                <div class="presence-title">Listening to Spotify</div>
                <div class="presence-main">${presence.spotify.song}</div>
                <div class="presence-sub">by ${presence.spotify.artist}</div>
            </div>
        `;
    } else if (presence.game) {
        presenceBox.style.display = "flex";
        presenceBox.className = "discord-presence-box game-active";
        const iconUrl = presence.game.assets && presence.game.assets.large_image
            ? (presence.game.assets.large_image.startsWith("mp:") 
                ? `https://media.discordapp.net/${presence.game.assets.large_image.slice(3)}`
                : `https://cdn.discordapp.com/app-assets/${presence.game.id}/${presence.game.assets.large_image}.png`)
            : null;

        presenceBox.innerHTML = `
            <div class="presence-icon"><i class="fa-solid fa-gamepad"></i></div>
            ${iconUrl ? `<img src="${iconUrl}" class="presence-art" alt="Game Art" />` : ""}
            <div class="presence-info">
                <div class="presence-title">Playing Game</div>
                <div class="presence-main">${presence.game.name}</div>
                ${presence.game.details ? `<div class="presence-sub">${presence.game.details}</div>` : ""}
            </div>
        `;
    } else if (presence.customStatus && presence.customStatus.text) {
        presenceBox.style.display = "flex";
        presenceBox.className = "discord-presence-box status-active";
        presenceBox.innerHTML = `
            <div class="presence-icon"><i class="fa-solid fa-comment-dots"></i></div>
            <div class="presence-info">
                <div class="presence-main">${presence.customStatus.emoji ? presence.customStatus.emoji + " " : ""}${presence.customStatus.text}</div>
            </div>
        `;
    } else {
        presenceBox.style.display = "none";
    }
}

/**
 * Màn hình Click to Enter
 */
function initEnterScreen(musicPlayer, effectsEngine) {
    const enterScreen = document.getElementById("enter-screen");
    const profileCard = document.getElementById("profile-card");
    if (!enterScreen) return;

    const handleEnter = () => {
        if (effectsEngine) effectsEngine.playClick();
        if (musicPlayer && window.CONFIG.music.autoplayOnEnter) {
            musicPlayer.play();
        }

        enterScreen.classList.add("fade-out");
        if (profileCard) profileCard.classList.add("card-appear");

        setTimeout(() => { enterScreen.style.display = "none"; }, 800);
        window.removeEventListener("click", handleEnter);
        window.removeEventListener("keydown", handleEnter);
    };

    window.addEventListener("click", handleEnter, { once: true });
    window.addEventListener("keydown", handleEnter, { once: true });
}

/**
 * Hiệu ứng gõ chữ Typewriter
 */
let typewriterTimeout = null;
function initTypewriter(quotes) {
    const textEl = document.getElementById("typewriter-text");
    if (!textEl || !quotes || quotes.length === 0) return;

    if (typewriterTimeout) clearTimeout(typewriterTimeout);

    let quoteIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentQuote = quotes[quoteIndex];
        
        if (isDeleting) {
            textEl.textContent = currentQuote.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textEl.textContent = currentQuote.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 75;

        if (!isDeleting && charIndex === currentQuote.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            quoteIndex = (quoteIndex + 1) % quotes.length;
            speed = 400;
        }

        typewriterTimeout = setTimeout(type, speed);
    };

    type();
}

/**
 * Hiệu ứng nghiêng 3D Parallax
 */
function initCardTilt() {
    const card = document.getElementById("profile-card");
    if (!card || window.innerWidth < 768) return;

    let bounds;
    function updateBounds() { bounds = card.getBoundingClientRect(); }
    updateBounds();
    window.addEventListener("resize", updateBounds);

    document.addEventListener("mousemove", (e) => {
        if (!bounds) return;
        const leftX = e.clientX - bounds.x;
        const topY = e.clientY - bounds.y;

        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };

        const maxAngle = 8;
        const rotateX = (-center.y / (bounds.height / 2)) * maxAngle;
        const rotateY = (center.x / (bounds.width / 2)) * maxAngle;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
        card.style.setProperty("--glare-x", `${(leftX / bounds.width) * 100}%`);
        card.style.setProperty("--glare-y", `${(topY / bounds.height) * 100}%`);
    });

    document.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
}

/**
 * Con trỏ chuột neon & Sparkles
 */
function initCustomCursor() {
    const cursor = document.getElementById("custom-cursor");
    const follower = document.getElementById("cursor-follower");
    if (!cursor || !follower || window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

        if (window.CONFIG.theme && window.CONFIG.theme.sparkleTrail && Math.random() > 0.65) {
            createSparkle(mouseX, mouseY);
        }
    });

    function renderFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        requestAnimationFrame(renderFollower);
    }
    renderFollower();

    document.addEventListener("mousedown", () => {
        follower.classList.add("active");
        for (let i = 0; i < 4; i++) createSparkle(mouseX, mouseY);
    });
    document.addEventListener("mouseup", () => follower.classList.remove("active"));
}

function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle-particle";
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 25 + 10;
    sparkle.style.setProperty("--dest-x", `${Math.cos(angle) * speed}px`);
    sparkle.style.setProperty("--dest-y", `${Math.sin(angle) * speed}px`);

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
}

/**
 * Bộ đếm VIEW THẬT (Real Server View Counter)
 */
async function initRealViewCounter() {
    const viewEl = document.getElementById("profile-views");
    if (!viewEl) return;

    try {
        // Gửi POST request tới API của server Railway để tăng view và lấy kết quả
        const res = await fetch("/api/views", { method: "POST" });
        if (res.ok) {
            const data = await res.json();
            if (data && typeof data.views === "number") {
                viewEl.textContent = data.views.toLocaleString();
                return;
            }
        }
    } catch (e) {
        console.warn("Không kết nối được server view, dùng fallback:", e);
    }

    // Fallback nếu chạy ở môi trường không có server
    let views = parseInt(localStorage.getItem("anklabo_bio_views") || (window.CONFIG.profile.viewsInitial || 1337));
    views += 1;
    localStorage.setItem("anklabo_bio_views", views.toString());
    viewEl.textContent = views.toLocaleString();
}

/**
 * Gán âm thanh click UI vào các nút
 */
function initClickSounds(effectsEngine) {
    if (!effectsEngine) return;
    document.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest(".social-btn") || e.target.closest(".bio-badge")) {
            effectsEngine.playClick();
        }
    });
}

function showBioToast(msg) {
    let toast = document.getElementById("bio-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "bio-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = "show";
    setTimeout(() => { toast.className = ""; }, 3200);
}
window.showBioToast = showBioToast;
