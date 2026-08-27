/**
 * Main Controller for AnkLaBo Bio
 * Điều khiển màn hình Click-to-enter, Typewriter, 3D Tilt, Particle Canvas & Custom Cursor
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Tải cấu hình từ LocalStorage nếu có
    const savedConfig = localStorage.getItem("anklabo_bio_custom_config");
    if (savedConfig) {
        try {
            window.CONFIG = Object.assign({}, window.CONFIG, JSON.parse(savedConfig));
        } catch (e) {}
    }

    // 2. Khởi tạo các module
    const auth = new window.BioAuth(window.CONFIG);
    const musicPlayer = new window.MusicPlayer(window.CONFIG);
    
    // Khởi tạo Discord Manager
    const discordManager = new window.DiscordManager(
        window.CONFIG,
        (profileUpdate) => handleDiscordProfileUpdate(profileUpdate),
        (presenceUpdate) => handleDiscordPresenceUpdate(presenceUpdate)
    );

    // Khởi tạo Config Panel
    const configPanel = new window.ConfigPanel(auth, discordManager, musicPlayer);

    // 3. Render giao diện Bio lần đầu
    renderBioProfile(window.CONFIG);

    // 4. Màn hình chờ "Click to enter"
    initEnterScreen(musicPlayer);

    // 5. Hiệu ứng gõ chữ (Typewriter)
    initTypewriter(window.CONFIG.profile.bioQuotes);

    // 6. Hiệu ứng nghiêng 3D (Parallax Card Tilt)
    initCardTilt();

    // 7. Con trỏ chuột neon & Sparkle Trail
    initCustomCursor();

    // 8. Background Canvas (Hạt bụi ánh sáng vũ trụ)
    initBackgroundCanvas();

    // 9. Bộ đếm lượt xem (View Counter)
    initViewCounter();
});

/**
 * Render toàn bộ thông tin Bio từ CONFIG
 */
function renderBioProfile(config) {
    if (!config) return;

    // CSS Variables màu chủ đạo
    if (config.theme && config.theme.accentColor) {
        document.documentElement.style.setProperty("--accent", config.theme.accentColor);
        document.documentElement.style.setProperty("--accent-glow", config.theme.glowColor || "rgba(139, 92, 246, 0.4)");
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

    // Tên & Handle & UID
    const nameEl = document.getElementById("profile-name");
    if (nameEl) nameEl.textContent = config.profile.username || "AnkLaBo";

    const handleEl = document.getElementById("profile-handle");
    if (handleEl) handleEl.textContent = `@${config.profile.handle || "anklabo29ms"}`;

    const uidEl = document.getElementById("profile-uid");
    if (uidEl) uidEl.textContent = `UID: ${config.profile.uid || "1"}`;

    const locationEl = document.getElementById("profile-location");
    if (locationEl) {
        locationEl.textContent = config.profile.location || "Vietnam";
    }

    // Badges
    const badgesContainer = document.getElementById("profile-badges");
    if (badgesContainer) {
        badgesContainer.innerHTML = "";
        const badges = config.badges || [];
        badges.forEach(badge => {
            const span = document.createElement("div");
            span.className = "bio-badge";
            span.setAttribute("data-tooltip", badge.tooltip || badge.name);
            span.innerHTML = `<i class="${badge.icon}" style="color: ${badge.color}"></i>`;
            badgesContainer.appendChild(span);
        });
    }

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

    // Background Image nếu không dùng video
    const bgImageEl = document.getElementById("bg-image-layer");
    if (bgImageEl) {
        if (config.theme.backgroundImageUrl) {
            bgImageEl.style.backgroundImage = `url('${config.theme.backgroundImageUrl}')`;
        }
    }
}
window.renderBioProfile = renderBioProfile;

/**
 * Xử lý cập nhật thông tin khi sync Discord
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
    if (profile.accentColor) {
        document.documentElement.style.setProperty("--accent", profile.accentColor);
    }
}

/**
 * Xử lý trạng thái trực tiếp Discord (Lanyard Presence)
 */
function handleDiscordPresenceUpdate(presence) {
    if (!presence) return;

    // Chấm trạng thái Avatar (online, idle, dnd, offline)
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

    // Card hoạt động Discord (Spotify hoặc Game)
    const presenceBox = document.getElementById("discord-presence-box");
    if (!presenceBox) return;

    if (presence.spotify) {
        // Đang nghe Spotify
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
        // Đang chơi game
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
        // Custom Status
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
 * Khởi tạo màn hình Click to Enter
 */
function initEnterScreen(musicPlayer) {
    const enterScreen = document.getElementById("enter-screen");
    const profileCard = document.getElementById("profile-card");
    if (!enterScreen) return;

    const handleEnter = () => {
        // Phát nhạc
        if (musicPlayer && window.CONFIG.music.autoplayOnEnter) {
            musicPlayer.play();
        }

        // Hiệu ứng chuyển cảnh
        enterScreen.classList.add("fade-out");
        if (profileCard) {
            profileCard.classList.add("card-appear");
        }

        setTimeout(() => {
            enterScreen.style.display = "none";
        }, 800);

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

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentQuote.length) {
            speed = 2000; // Dừng lại đọc
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
 * Hiệu ứng nghiêng 3D (Parallax Card Tilt)
 */
function initCardTilt() {
    const card = document.getElementById("profile-card");
    if (!card || window.innerWidth < 768) return;

    let bounds;
    function updateBounds() {
        bounds = card.getBoundingClientRect();
    }
    updateBounds();
    window.addEventListener("resize", updateBounds);

    document.addEventListener("mousemove", (e) => {
        if (!bounds) return;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;

        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };

        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

        // Góc xoay tối đa 8 độ
        const maxAngle = 8;
        const rotateX = (-center.y / (bounds.height / 2)) * maxAngle;
        const rotateY = (center.x / (bounds.width / 2)) * maxAngle;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;

        // Specular glare reflection
        card.style.setProperty("--glare-x", `${(leftX / bounds.width) * 100}%`);
        card.style.setProperty("--glare-y", `${(topY / bounds.height) * 100}%`);
    });

    document.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
}

/**
 * Con trỏ chuột neon & Sparkle Trail
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

        if (window.CONFIG.theme && window.CONFIG.theme.sparkleTrail && Math.random() > 0.6) {
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

    // Hiệu ứng khi bấm chuột
    document.addEventListener("mousedown", () => {
        follower.classList.add("active");
        for (let i = 0; i < 5; i++) {
            createSparkle(mouseX, mouseY);
        }
    });
    document.addEventListener("mouseup", () => follower.classList.remove("active"));
}

function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle-particle";
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 30 + 10;
    const destX = Math.cos(angle) * speed;
    const destY = Math.sin(angle) * speed;

    sparkle.style.setProperty("--dest-x", `${destX}px`);
    sparkle.style.setProperty("--dest-y", `${destY}px`);

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
}

/**
 * Hiệu ứng Canvas Hạt sao vũ trụ
 */
function initBackgroundCanvas() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 12000));
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.6 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const accentColor = (window.CONFIG.theme && window.CONFIG.theme.accentColor) || "#8b5cf6";

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 160, 255, ${p.alpha})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = accentColor;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/**
 * Bộ đếm lượt xem (View Counter)
 */
function initViewCounter() {
    const viewEl = document.getElementById("profile-views");
    if (!viewEl) return;

    let views = parseInt(localStorage.getItem("anklabo_bio_views") || (window.CONFIG.profile.viewsInitial || 1337));
    views += 1;
    localStorage.setItem("anklabo_bio_views", views.toString());

    viewEl.textContent = views.toLocaleString();
}

/**
 * Toast thông báo nhỏ góc màn hình
 */
function showBioToast(msg) {
    let toast = document.getElementById("bio-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "bio-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = "show";
    setTimeout(() => {
        toast.className = "";
    }, 3200);
}
window.showBioToast = showBioToast;
