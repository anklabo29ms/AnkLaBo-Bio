/**
 * main.js v3.0 — AnkLaBo Bio
 * Fixes: single typewriter instance, cursor centering, banner/no-banner layout,
 *        card glare mouse tracking, avatar decoration render, enter particles,
 *        badge CDN image support, sparkle toggle, real view counter.
 */

document.addEventListener("DOMContentLoaded", () => {

    /* 1. Merge saved local config */
    try {
        const saved = localStorage.getItem("anklabo_bio_custom_config");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed.badges) && Array.isArray(window.CONFIG.badges)) {
                const enabledMap = new Map(parsed.badges.map(b => [b.id, b.enabled]));
                window.CONFIG.badges.forEach(b => {
                    if (enabledMap.has(b.id)) {
                        b.enabled = enabledMap.get(b.id);
                    }
                });
            }
            // Deep-merge top-level sections only (skip badges array since handled above)
            Object.keys(parsed).forEach(k => {
                if (k === "badges") return;
                if (typeof parsed[k] === "object" && !Array.isArray(parsed[k])) {
                    window.CONFIG[k] = Object.assign({}, window.CONFIG[k] || {}, parsed[k]);
                } else {
                    window.CONFIG[k] = parsed[k];
                }
            });
        }
    } catch (e) { /* ignore */ }

    const CFG = window.CONFIG;

    /* 2. Instantiate modules */
    const effectsEngine  = new window.EffectsEngine();
    const auth           = new window.BioAuth(CFG);
    const musicPlayer    = new window.MusicPlayer(CFG);
    const discordManager = new window.DiscordManager(
        CFG,
        (profileData)  => handleDiscordProfile(profileData),
        (presenceData) => handleDiscordPresence(presenceData)
    );
    new window.ConfigPanel(auth, discordManager, musicPlayer, effectsEngine);

    /* 3. Render initial UI */
    renderBioProfile(CFG);

    /* 4. Background effect */
    effectsEngine.setEffect(CFG.theme.backgroundMode || "starfield");
    effectsEngine.toggleScanlines(CFG.theme.scanlines !== false);

    /* 5. Enter screen */
    initEnterScreen(musicPlayer, effectsEngine);

    /* 6. Typewriter — single timer instance (fix: no duplicate timers on re-render) */
    window._typewriterRunning = false;
    startTypewriter(CFG.profile.bioQuotes);

    /* 7. Card tilt & glare */
    initCardTilt();
    initCardGlare();

    /* 8. Custom cursor */
    initCustomCursor(CFG);

    /* 9. Real view counter */
    initRealViewCounter(CFG);

    /* 10. Lanyard Discord sync */
    if (CFG.discord.userId) {
        discordManager.initLanyard(CFG.discord.userId);
    }

    /* 11. Enter-screen particle canvas */
    initEnterParticles();
});

/* =========================================================
   RENDER BIO PROFILE
   ========================================================= */
function renderBioProfile(cfg) {
    if (!cfg) return;

    // Accent colour
    if (cfg.theme.accentColor) {
        document.documentElement.style.setProperty("--accent",      cfg.theme.accentColor);
        document.documentElement.style.setProperty("--accent-glow", cfg.theme.glowColor || "rgba(139,92,246,.42)");
    }

    // Banner
    const card      = document.getElementById("profile-card");
    const bannerEl  = document.getElementById("profile-banner");
    if (bannerEl && card) {
        if (cfg.profile.banner) {
            bannerEl.style.backgroundImage = `url('${cfg.profile.banner}')`;
            card.classList.remove("no-banner");
        } else {
            bannerEl.style.backgroundImage = "";
            card.classList.add("no-banner");
        }
    }

    // Avatar
    const avatarEl = document.getElementById("profile-avatar-img");
    if (avatarEl && cfg.profile.avatar) avatarEl.src = cfg.profile.avatar;

    // Enter screen avatar sync
    const enterAv = document.getElementById("enter-avatar");
    if (enterAv && cfg.profile.avatar) enterAv.src = cfg.profile.avatar;

    // Avatar ring effect
    const ringEl = document.getElementById("profile-avatar-ring");
    if (ringEl) ringEl.className = `avatar-ring ${cfg.theme.avatarEffect || "rainbow"}`;

    // Username
    const nameEl = document.getElementById("profile-name");
    if (nameEl) {
        nameEl.textContent = cfg.profile.username || "AnkLaBo";
        nameEl.className   = `username ${cfg.theme.usernameEffect || "gradient"}`;
    }

    // Handle
    const handleEl = document.getElementById("profile-handle");
    if (handleEl) handleEl.textContent = `@${cfg.profile.handle || "anklabo29ms"}`;

    // UID
    const uidEl = document.getElementById("profile-uid");
    if (uidEl) {
        const span = uidEl.querySelector("span");
        if (span) span.textContent = cfg.profile.uid || "1";
    }

    // Location
    const locEl = document.getElementById("profile-location");
    if (locEl) {
        const span = locEl.querySelector("span");
        if (span) span.textContent = cfg.profile.location || "Vietnam";
    }

    // Badges
    renderBadgesWithSmartTooltip(cfg.badges || []);

    // Social links
    renderSocialLinks(cfg.socials || []);

    // Background image layer
    const bgImg = document.getElementById("bg-image-layer");
    if (bgImg && cfg.theme.backgroundImageUrl) {
        bgImg.style.backgroundImage = `url('${cfg.theme.backgroundImageUrl}')`;
    }

    // Typewriter quotes (restart only if quotes changed)
    startTypewriter(cfg.profile.bioQuotes);
}
window.renderBioProfile = renderBioProfile;

/* =========================================================
   BADGES — supports type:"img" (Discord CDN) and type:"fa"
   ========================================================= */
function renderBadgesWithSmartTooltip(badges) {
    const container  = document.getElementById("profile-badges");
    const tooltipBar = document.getElementById("badge-tooltip-bar");
    if (!container || !tooltipBar) return;

    container.innerHTML = "";
    const active = badges.filter(b => b.enabled !== false);

    active.forEach(badge => {
        const el = document.createElement("div");
        el.className = "bio-badge";

        if (badge.type === "img") {
            const img  = document.createElement("img");
            img.src    = badge.icon;
            img.alt    = badge.name;
            img.className = "badge-img";
            img.onerror = () => {
                // Fallback to Discord blurple icon if CDN fails
                img.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='12' fill='%235865f2'/></svg>`;
            };
            el.appendChild(img);
        } else {
            el.innerHTML = `<i class="${badge.icon}" style="color:${badge.color}"></i>`;
        }

        // Desktop hover
        el.addEventListener("mouseenter", () => showBadgeTooltip(badge, el));
        el.addEventListener("mouseleave", hideBadgeTooltip);
        // Mobile tap
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            showBadgeTooltip(badge, el);
        });

        container.appendChild(el);
    });

    // Dismiss on outside click
    document.addEventListener("click", hideBadgeTooltip);
}

let _tooltipTimer = null;
function showBadgeTooltip(badge, triggerEl) {
    const bar = document.getElementById("badge-tooltip-bar");
    if (!bar) return;
    clearTimeout(_tooltipTimer);
    document.querySelectorAll(".bio-badge").forEach(b => b.classList.remove("active-badge"));
    triggerEl.classList.add("active-badge");

    let iconHtml;
    if (badge.type === "img") {
        iconHtml = `<img src="${badge.icon}" class="tooltip-badge-img" alt="">`;
    } else {
        iconHtml = `<span class="tooltip-icon"><i class="${badge.icon}" style="color:${badge.color}"></i></span>`;
    }

    bar.innerHTML = `
        <div class="tooltip-bar-content">
            ${iconHtml}
            <span class="tooltip-title">${badge.name}</span>
            <span class="tooltip-sep">•</span>
            <span class="tooltip-desc">${badge.tooltip || badge.name}</span>
        </div>`;
    bar.classList.add("visible");
}

function hideBadgeTooltip() {
    _tooltipTimer = setTimeout(() => {
        const bar = document.getElementById("badge-tooltip-bar");
        if (bar) bar.classList.remove("visible");
        document.querySelectorAll(".bio-badge").forEach(b => b.classList.remove("active-badge"));
    }, 180);
}

/* =========================================================
   SOCIAL LINKS — pill with icon + label
   ========================================================= */
function renderSocialLinks(socials) {
    const container = document.getElementById("profile-socials");
    if (!container) return;
    container.innerHTML = "";
    socials.forEach(item => {
        const a       = document.createElement("a");
        a.className   = "social-btn";
        a.href        = item.url;
        a.target      = "_blank";
        a.rel         = "noopener noreferrer";
        a.style.setProperty("--s-color", item.color || "#fff");
        a.innerHTML   = `<i class="${item.icon}"></i>${item.label ? `<span class="social-label">${item.label}</span>` : ""}`;
        container.appendChild(a);
    });
}

/* =========================================================
   DISCORD PROFILE UPDATE (avatar, banner, decoration)
   ========================================================= */
function handleDiscordProfile(data) {
    if (!data) return;

    if (data.avatar) {
        const img = document.getElementById("profile-avatar-img");
        const ea  = document.getElementById("enter-avatar");
        if (img) img.src = data.avatar;
        if (ea)  ea.src  = data.avatar;
    }

    if (data.banner) {
        const bannerEl = document.getElementById("profile-banner");
        const card     = document.getElementById("profile-card");
        if (bannerEl) {
            bannerEl.style.backgroundImage = `url('${data.banner}')`;
            card && card.classList.remove("no-banner");
        }
    }

    // Avatar Decoration overlay
    const decorEl = document.getElementById("avatar-decoration");
    if (decorEl) {
        if (data.decoration) {
            decorEl.src = data.decoration;
            decorEl.classList.add("loaded");
            decorEl.onerror = () => decorEl.classList.remove("loaded");
        } else {
            decorEl.classList.remove("loaded");
        }
    }

    if (data.username) {
        const n = document.getElementById("profile-name");
        if (n) n.textContent = data.username;
    }
}

/* =========================================================
   DISCORD PRESENCE (Spotify / Game / Custom Status)
   ========================================================= */
function handleDiscordPresence(presence) {
    // Status dot
    const dot = document.getElementById("profile-status-dot");
    if (dot) {
        const statusNames = { online: "Trực tuyến", idle: "Vắng mặt", dnd: "Đừng làm phiền", offline: "Ngoại tuyến" };
        const s = presence ? presence.status : "offline";
        dot.className = `status-dot ${s}`;
        dot.setAttribute("data-tooltip", statusNames[s] || s);
    }

    const box = document.getElementById("discord-presence-box");
    if (!box || !presence) { if (box) box.style.display = "none"; return; }

    if (presence.spotify) {
        const sp = presence.spotify;
        box.style.display = "flex";
        box.className = "discord-presence-box spotify-active";
        box.innerHTML = `
            <img src="${sp.albumArtUrl}" class="presence-art" alt="Spotify">
            <div class="presence-info">
                <div class="presence-label">🎵 Listening to Spotify</div>
                <div class="presence-main">${escHtml(sp.song)}</div>
                <div class="presence-sub">by ${escHtml(sp.artist)}</div>
                <div class="spotify-progress-bar">
                    <div class="spotify-progress-fill"></div>
                </div>
            </div>`;
    } else if (presence.game) {
        const g = presence.game;
        const iconUrl = g.assets && g.assets.large_image
            ? (g.assets.large_image.startsWith("mp:")
                ? `https://media.discordapp.net/${g.assets.large_image.slice(3)}`
                : `https://cdn.discordapp.com/app-assets/${g.id}/${g.assets.large_image}.png`)
            : null;

        box.style.display = "flex";
        box.className = "discord-presence-box game-active";
        box.innerHTML = `
            ${iconUrl ? `<img src="${iconUrl}" class="presence-art" alt="Game">` : ""}
            <div class="presence-info">
                <div class="presence-label">🎮 Playing</div>
                <div class="presence-main">${escHtml(g.name)}</div>
                ${g.details ? `<div class="presence-sub">${escHtml(g.details)}</div>` : ""}
            </div>`;
    } else if (presence.customStatus && presence.customStatus.text) {
        const cs = presence.customStatus;
        box.style.display = "flex";
        box.className = "discord-presence-box status-active";
        box.innerHTML = `
            <div class="presence-info">
                <div class="presence-main">${cs.emoji ? cs.emoji + " " : ""}${escHtml(cs.text)}</div>
            </div>`;
    } else {
        box.style.display = "none";
    }
}

function escHtml(s) {
    if (!s) return "";
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* =========================================================
   ENTER SCREEN
   ========================================================= */
function initEnterScreen(musicPlayer, effectsEngine) {
    const screen = document.getElementById("enter-screen");
    const card   = document.getElementById("profile-card");
    if (!screen) return;

    const enter = () => {
        effectsEngine && effectsEngine.playClick();
        if (musicPlayer && window.CONFIG.music.autoplayOnEnter) musicPlayer.play();

        screen.classList.add("fade-out");
        card   && card.classList.add("card-appear");
        setTimeout(() => { screen.style.display = "none"; }, 900);

        window.removeEventListener("click",   enter);
        window.removeEventListener("keydown", enter);
    };

    window.addEventListener("click",   enter, { once: true });
    window.addEventListener("keydown", enter, { once: true });
}

/* =========================================================
   ENTER SCREEN PARTICLE CANVAS
   ========================================================= */
function initEnterParticles() {
    const canvas = document.getElementById("enter-particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];
    let W, H;

    const resize = () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 70; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.8 + 0.3,
            vx: (Math.random() - .5) * .4,
            vy: (Math.random() - .5) * .4,
            alpha: Math.random() * .5 + .15
        });
    }

    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#8b5cf6";

    const frame = () => {
        if (!document.getElementById("enter-screen") ||
            document.getElementById("enter-screen").style.display === "none") return;

        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x = (p.x + p.vx + W) % W;
            p.y = (p.y + p.vy + H) % H;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(frame);
    };
    frame();
}

/* =========================================================
   TYPEWRITER — single instance, no duplicates
   ========================================================= */
let _twTimer = null;
let _twQuotes = null;

function startTypewriter(quotes) {
    if (!quotes || quotes.length === 0) return;

    // If same quotes as before, do nothing (avoid restart on config save)
    if (JSON.stringify(quotes) === JSON.stringify(_twQuotes) && _twTimer) return;
    _twQuotes = quotes;

    // Kill existing timer
    if (_twTimer) { clearTimeout(_twTimer); _twTimer = null; }

    const el = document.getElementById("typewriter-text");
    if (!el) return;

    let qi = 0, ci = 0, deleting = false;

    const tick = () => {
        const q = quotes[qi];
        el.textContent = deleting
            ? q.substring(0, ci - 1)
            : q.substring(0, ci + 1);

        if (!deleting) ci++;
        else           ci--;

        let speed = deleting ? 38 : 72;

        if (!deleting && ci > q.length) {
            speed = 2000;
            deleting = true;
        } else if (deleting && ci < 0) {
            deleting = false;
            qi = (qi + 1) % quotes.length;
            ci = 0;
            speed = 450;
        }

        _twTimer = setTimeout(tick, speed);
    };

    tick();
}

/* =========================================================
   CARD TILT (3D Parallax)
   ========================================================= */
function initCardTilt() {
    const card = document.getElementById("profile-card");
    if (!card || window.matchMedia("(hover:none)").matches) return;

    card.addEventListener("mousemove", (e) => {
        const r    = card.getBoundingClientRect();
        const cx   = r.left + r.width  / 2;
        const cy   = r.top  + r.height / 2;
        const rotX = ((e.clientY - cy) / (r.height / 2)) * -5;
        const rotY = ((e.clientX - cx) / (r.width  / 2)) *  5;
        card.style.transform =
            `perspective(1000px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) scale3d(1.008,1.008,1)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)";
    });
}

/* =========================================================
   CARD GLARE (holographic shine follows mouse)
   ========================================================= */
function initCardGlare() {
    const card  = document.getElementById("profile-card");
    const glare = document.getElementById("card-glare");
    if (!card || !glare || window.matchMedia("(hover:none)").matches) return;

    card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
        const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
        card.style.setProperty("--glare-x", `${x}%`);
        card.style.setProperty("--glare-y", `${y}%`);
    });

    card.addEventListener("mouseleave", () => {
        card.style.setProperty("--glare-x", "50%");
        card.style.setProperty("--glare-y", "-20%");
    });
}

/* =========================================================
   CUSTOM CURSOR (centered with margin trick)
   ========================================================= */
function initCustomCursor(cfg) {
    const cursor   = document.getElementById("custom-cursor");
    const follower = document.getElementById("cursor-follower");
    if (!cursor || !follower || window.matchMedia("(hover:none)").matches) return;

    let fx = 0, fy = 0, mx = 0, my = 0;

    document.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.transform = `translate3d(${mx}px,${my}px,0)`;

        // Sparkle trail
        if (cfg.theme.sparkleTrail !== false && Math.random() > 0.68) {
            spawnSparkle(mx, my);
        }
    });

    const followLoop = () => {
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        follower.style.transform = `translate3d(${fx}px,${fy}px,0)`;
        requestAnimationFrame(followLoop);
    };
    followLoop();

    document.addEventListener("mousedown", () => {
        follower.classList.add("clicking");
        for (let i = 0; i < 5; i++) spawnSparkle(mx, my);
    });
    document.addEventListener("mouseup", () => follower.classList.remove("clicking"));
}

function spawnSparkle(x, y) {
    const s     = document.createElement("div");
    s.className = "sparkle-particle";
    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * 28 + 8;
    s.style.left = `${x}px`;
    s.style.top  = `${y}px`;
    s.style.setProperty("--dx", `${(Math.cos(angle) * dist).toFixed(1)}px`);
    s.style.setProperty("--dy", `${(Math.sin(angle) * dist).toFixed(1)}px`);
    s.style.background = `hsl(${Math.random()*60 + 240},100%,75%)`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 560);
}

/* =========================================================
   REAL VIEW COUNTER (Railway server API)
   ========================================================= */
async function initRealViewCounter(cfg) {
    const el = document.getElementById("profile-views");
    if (!el) return;

    try {
        const res  = await fetch("/api/views", { method: "POST" });
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        if (typeof data.views === "number") {
            el.textContent = data.views.toLocaleString("vi-VN");
            return;
        }
    } catch (e) {
        console.warn("[Views] API unavailable, using localStorage fallback");
    }

    // Fallback
    let v = parseInt(localStorage.getItem("anklabo_bio_views") || (cfg.profile.viewsInitial || 1337), 10);
    v += 1;
    localStorage.setItem("anklabo_bio_views", String(v));
    el.textContent = v.toLocaleString("vi-VN");
}

/* =========================================================
   GLOBAL TOAST
   ========================================================= */
function showBioToast(msg) {
    let t = document.getElementById("bio-toast");
    if (!t) {
        t = document.createElement("div");
        t.id = "bio-toast";
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className   = "show";
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.className = ""; }, 3200);
}
window.showBioToast = showBioToast;
