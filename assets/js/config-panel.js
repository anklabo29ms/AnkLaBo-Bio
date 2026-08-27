/**
 * Live Config Panel Controller for AnkLaBo Bio
 * Hỗ trợ:
 * 1. Mật khẩu in-memory (F5 tự động reset yêu cầu nhập lại)
 * 2. Fetch nhạc tự động qua link YouTube / MP3
 * 3. Tùy biến sâu Profile (Avatar effects, Username effects, Background modes, CRT scanlines)
 * 4. Quản lý bật/tắt toàn bộ Huy hiệu Discord
 */

class ConfigPanel {
    constructor(auth, discordManager, musicPlayer, effectsEngine) {
        this.auth = auth;
        this.discordManager = discordManager;
        this.musicPlayer = musicPlayer;
        this.effectsEngine = effectsEngine;

        this.currentConfig = JSON.parse(JSON.stringify(window.CONFIG));
        this.loadLocalConfig();

        this.initDOMElements();
        this.bindEvents();
    }

    initDOMElements() {
        this.configBtn = document.getElementById("open-config-btn");

        // Modal mật khẩu
        this.pwdModal = document.getElementById("password-modal");
        this.pwdInput = document.getElementById("password-input");
        this.pwdSubmit = document.getElementById("password-submit-btn");
        this.pwdError = document.getElementById("password-error-msg");
        this.pwdClose = document.getElementById("password-close-btn");

        // Modal config chính
        this.cfgModal = document.getElementById("config-modal");
        this.cfgClose = document.getElementById("config-close-btn");
        this.saveLocalBtn = document.getElementById("config-save-local-btn");
        this.exportBtn = document.getElementById("config-export-btn");
        this.resetBtn = document.getElementById("config-reset-btn");

        // Tabs
        this.tabBtns = document.querySelectorAll(".config-tab-btn");
        this.tabPanes = document.querySelectorAll(".config-tab-pane");

        // Discord actions
        this.discordSyncBtn = document.getElementById("cfg-discord-sync-btn");

        // YouTube / Music Fetch
        this.musicUrlInput = document.getElementById("cfg-music-url-input");
        this.musicFetchBtn = document.getElementById("cfg-music-fetch-btn");
    }

    bindEvents() {
        if (this.configBtn) {
            this.configBtn.addEventListener("click", () => this.handleOpenConfig());
        }

        if (this.pwdSubmit) {
            this.pwdSubmit.addEventListener("click", () => this.handlePasswordSubmit());
        }
        if (this.pwdInput) {
            this.pwdInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") this.handlePasswordSubmit();
            });
        }
        if (this.pwdClose) {
            this.pwdClose.addEventListener("click", () => this.closePasswordModal());
        }

        if (this.cfgClose) {
            this.cfgClose.addEventListener("click", () => this.closeConfigModal());
        }

        this.tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-tab");
                this.switchTab(targetTab);
            });
        });

        // Discord Sync
        if (this.discordSyncBtn) {
            this.discordSyncBtn.addEventListener("click", () => this.handleDiscordManualSync());
        }

        // Fetch link nhạc YouTube / MP3
        if (this.musicFetchBtn && this.musicUrlInput) {
            this.musicFetchBtn.addEventListener("click", () => this.handleFetchMusicUrl());
        }

        if (this.saveLocalBtn) {
            this.saveLocalBtn.addEventListener("click", () => this.saveToLocalStorage());
        }
        if (this.exportBtn) {
            this.exportBtn.addEventListener("click", () => this.exportConfigFile());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener("click", () => this.resetConfig());
        }

        this.bindLiveFormInputs();
    }

    loadLocalConfig() {
        const saved = localStorage.getItem("anklabo_bio_custom_config");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.currentConfig = Object.assign({}, this.currentConfig, parsed);
                window.CONFIG = this.currentConfig;
            } catch (e) {}
        }
    }

    handleOpenConfig() {
        if (this.effectsEngine) this.effectsEngine.playClick();
        if (this.auth.isAuthenticated) {
            this.openConfigModal();
        } else {
            this.openPasswordModal();
        }
    }

    openPasswordModal() {
        if (!this.pwdModal) return;
        this.pwdModal.classList.add("active");
        if (this.pwdInput) {
            this.pwdInput.value = "";
            setTimeout(() => this.pwdInput.focus(), 150);
        }
        if (this.pwdError) this.pwdError.classList.remove("visible");
    }

    closePasswordModal() {
        if (this.pwdModal) this.pwdModal.classList.remove("active");
    }

    async handlePasswordSubmit() {
        const pwd = this.pwdInput ? this.pwdInput.value : "";
        if (!pwd) return;

        const isValid = await this.auth.verify(pwd);
        if (isValid) {
            this.closePasswordModal();
            this.openConfigModal();
            if (typeof window.showBioToast === "function") {
                window.showBioToast("🔓 Mở khóa thành công!");
            }
        } else {
            if (this.pwdError) {
                this.pwdError.textContent = "Mật khẩu không chính xác!";
                this.pwdError.classList.add("visible");
            }
            if (this.pwdModal) {
                const card = this.pwdModal.querySelector(".glass-modal-card");
                if (card) {
                    card.classList.add("shake");
                    setTimeout(() => card.classList.remove("shake"), 500);
                }
            }
        }
    }

    openConfigModal() {
        if (!this.cfgModal) return;
        this.populateFormFields();
        this.cfgModal.classList.add("active");
    }

    closeConfigModal() {
        if (this.cfgModal) this.cfgModal.classList.remove("active");
    }

    switchTab(tabId) {
        if (this.effectsEngine) this.effectsEngine.playClick();
        this.tabBtns.forEach(b => b.classList.toggle("active", b.getAttribute("data-tab") === tabId));
        this.tabPanes.forEach(p => p.classList.toggle("active", p.id === `tab-${tabId}`));
    }

    populateFormFields() {
        const cfg = this.currentConfig;

        // Profile
        this.setVal("cfg-username", cfg.profile.username);
        this.setVal("cfg-handle", cfg.profile.handle);
        this.setVal("cfg-uid", cfg.profile.uid);
        this.setVal("cfg-avatar", cfg.profile.avatar);
        this.setVal("cfg-banner", cfg.profile.banner);
        this.setVal("cfg-location", cfg.profile.location);
        this.setVal("cfg-quotes", (cfg.profile.bioQuotes || []).join("\n"));
        this.setVal("cfg-avatar-effect", cfg.theme.avatarEffect || "rainbow");
        this.setVal("cfg-username-effect", cfg.theme.usernameEffect || "gradient");

        // Discord
        this.setVal("cfg-discord-user-id", cfg.discord.userId);
        this.setCheck("cfg-discord-auto-sync", cfg.discord.autoSyncProfile);
        this.setCheck("cfg-discord-show-presence", cfg.discord.showPresence);

        // Theme & Effects
        this.setVal("cfg-theme-accent", cfg.theme.accentColor);
        this.setVal("cfg-theme-bg-mode", cfg.theme.backgroundMode || "starfield");
        this.setVal("cfg-theme-bg-img", cfg.theme.backgroundImageUrl);
        this.setVal("cfg-theme-bg-vid", cfg.theme.backgroundVideoUrl);
        this.setCheck("cfg-theme-scanlines", cfg.theme.scanlines !== false);
        this.setCheck("cfg-theme-click-sound", cfg.theme.clickSound !== false);

        // Badges Manager Checklist
        this.renderBadgesChecklist();

        // Social links list editor
        this.renderSocialListEditor();

        // Playlist Editor
        this.renderPlaylistEditor();
    }

    renderBadgesChecklist() {
        const container = document.getElementById("cfg-badges-checklist");
        if (!container) return;

        container.innerHTML = "";
        const badges = this.currentConfig.badges || [];

        badges.forEach((b, index) => {
            const item = document.createElement("label");
            item.className = "cfg-badge-toggle-item";
            item.innerHTML = `
                <input type="checkbox" data-index="${index}" ${b.enabled !== false ? "checked" : ""}>
                <i class="${b.icon}" style="color: ${b.color}; margin-right: 6px;"></i>
                <span>${b.name}</span>
            `;
            item.querySelector("input").addEventListener("change", (e) => {
                badges[index].enabled = e.target.checked;
                this.applyLiveChanges();
            });
            container.appendChild(item);
        });
    }

    renderPlaylistEditor() {
        const container = document.getElementById("cfg-playlist-editor");
        if (!container) return;

        container.innerHTML = "";
        const list = (this.currentConfig.music && this.currentConfig.music.playlist) ? this.currentConfig.music.playlist : [];

        list.forEach((track, idx) => {
            const row = document.createElement("div");
            row.className = "cfg-playlist-row";
            row.innerHTML = `
                <div class="playlist-row-info">
                    <div class="playlist-track-title">#${idx + 1} ${track.title}</div>
                    <div class="playlist-track-sub">${track.artist} (${track.type === "youtube" ? "YouTube" : "Audio"})</div>
                </div>
                <div class="playlist-row-actions">
                    <button type="button" class="cfg-btn btn-play-track" data-index="${idx}" title="Phát bài này"><i class="fa-solid fa-play"></i></button>
                    <button type="button" class="cfg-btn danger btn-del-track" data-index="${idx}" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            container.appendChild(row);
        });

        container.querySelectorAll(".btn-play-track").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                if (this.musicPlayer) {
                    this.musicPlayer.currentIndex = idx;
                    this.musicPlayer.loadTrack(list[idx]);
                    this.musicPlayer.play();
                }
            });
        });

        container.querySelectorAll(".btn-del-track").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                list.splice(idx, 1);
                this.renderPlaylistEditor();
                this.applyLiveChanges();
            });
        });
    }

    async handleFetchMusicUrl() {
        const url = this.musicUrlInput.value.trim();
        if (!url) {
            alert("Vui lòng dán link YouTube hoặc MP3!");
            return;
        }

        if (this.musicFetchBtn) this.musicFetchBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang tải...`;

        try {
            const track = await MusicPlayer.fetchTrackMetadata(url);
            if (track) {
                if (!this.currentConfig.music.playlist) this.currentConfig.music.playlist = [];
                this.currentConfig.music.playlist.push(track);
                this.renderPlaylistEditor();
                this.musicUrlInput.value = "";

                // Tải và phát bài vừa thêm
                if (this.musicPlayer) {
                    this.musicPlayer.playlist = this.currentConfig.music.playlist;
                    this.musicPlayer.currentIndex = this.currentConfig.music.playlist.length - 1;
                    this.musicPlayer.loadTrack(track);
                    this.musicPlayer.play();
                }

                if (typeof window.showBioToast === "function") {
                    window.showBioToast(`🎵 Đã thêm bài hát: ${track.title}`);
                }
            }
        } catch (e) {
            alert("Không thể trích xuất bài hát từ link này. Hãy kiểm tra lại URL!");
        } finally {
            if (this.musicFetchBtn) this.musicFetchBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down"></i> Lấy & Thêm`;
        }
    }

    renderSocialListEditor() {
        const container = document.getElementById("cfg-social-list");
        if (!container) return;

        container.innerHTML = "";
        const socials = this.currentConfig.socials || [];

        socials.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "cfg-social-row";
            row.innerHTML = `
                <input type="text" class="cfg-input social-name" value="${item.name}" placeholder="Tên" />
                <input type="text" class="cfg-input social-icon" value="${item.icon}" placeholder="FontAwesome Class" />
                <input type="text" class="cfg-input social-url" value="${item.url}" placeholder="URL liên kết" />
                <button type="button" class="cfg-btn danger btn-del-social" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
            `;
            container.appendChild(row);
        });

        container.querySelectorAll(".btn-del-social").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                this.currentConfig.socials.splice(idx, 1);
                this.renderSocialListEditor();
                this.applyLiveChanges();
            });
        });
    }

    bindLiveFormInputs() {
        const listen = (id, event, callback) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(event, callback);
        };

        listen("cfg-username", "input", (e) => {
            this.currentConfig.profile.username = e.target.value;
            this.applyLiveChanges();
        });
        listen("cfg-avatar", "input", (e) => {
            this.currentConfig.profile.avatar = e.target.value;
            this.applyLiveChanges();
        });
        listen("cfg-avatar-effect", "change", (e) => {
            this.currentConfig.theme.avatarEffect = e.target.value;
            this.applyLiveChanges();
        });
        listen("cfg-username-effect", "change", (e) => {
            this.currentConfig.theme.usernameEffect = e.target.value;
            this.applyLiveChanges();
        });
        listen("cfg-theme-bg-mode", "change", (e) => {
            this.currentConfig.theme.backgroundMode = e.target.value;
            if (this.effectsEngine) this.effectsEngine.setEffect(e.target.value);
            this.applyLiveChanges();
        });
        listen("cfg-theme-accent", "input", (e) => {
            this.currentConfig.theme.accentColor = e.target.value;
            this.applyLiveChanges();
        });
        listen("cfg-theme-scanlines", "change", (e) => {
            this.currentConfig.theme.scanlines = e.target.checked;
            if (this.effectsEngine) this.effectsEngine.toggleScanlines(e.target.checked);
        });
        listen("cfg-theme-click-sound", "change", (e) => {
            this.currentConfig.theme.clickSound = e.target.checked;
        });
    }

    applyLiveChanges() {
        window.CONFIG = this.currentConfig;
        if (typeof window.renderBioProfile === "function") {
            window.renderBioProfile(this.currentConfig);
        }
        if (this.currentConfig.theme && this.currentConfig.theme.accentColor) {
            document.documentElement.style.setProperty("--accent", this.currentConfig.theme.accentColor);
        }
    }

    async handleDiscordManualSync() {
        const userId = document.getElementById("cfg-discord-user-id").value.trim();
        if (!userId) {
            alert("Vui lòng nhập Discord User ID!");
            return;
        }

        this.currentConfig.discord.userId = userId;
        if (this.discordSyncBtn) this.discordSyncBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang đồng bộ...`;

        try {
            const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
            if (!res.ok) throw new Error("Không tìm thấy User ID");
            const data = await res.json();
            
            if (data.success && data.data) {
                const u = data.data.discord_user;
                const isGif = u.avatar && u.avatar.startsWith("a_");
                const avatar = u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${isGif ? "gif" : "png"}?size=512` : null;

                if (avatar) {
                    this.currentConfig.profile.avatar = avatar;
                    this.setVal("cfg-avatar", avatar);
                }
                this.currentConfig.profile.username = u.global_name || u.username;
                this.setVal("cfg-username", this.currentConfig.profile.username);
                this.setVal("cfg-handle", u.username);

                this.applyLiveChanges();
                this.discordManager.initLanyard(userId);

                if (typeof window.showBioToast === "function") {
                    window.showBioToast(`✨ Đã đồng bộ Discord: ${u.global_name || u.username}`);
                }
            }
        } catch (e) {
            alert("Không thể kết nối Discord ID này. Hãy chắc chắn ID chính xác.");
        } finally {
            if (this.discordSyncBtn) this.discordSyncBtn.innerHTML = `<i class="fa-brands fa-discord"></i> Đồng bộ ngay`;
        }
    }

    collectCurrentForm() {
        this.currentConfig.profile.username = this.getVal("cfg-username");
        this.currentConfig.profile.handle = this.getVal("cfg-handle");
        this.currentConfig.profile.uid = this.getVal("cfg-uid");
        this.currentConfig.profile.avatar = this.getVal("cfg-avatar");
        this.currentConfig.profile.banner = this.getVal("cfg-banner");
        this.currentConfig.profile.location = this.getVal("cfg-location");
        this.currentConfig.profile.bioQuotes = this.getVal("cfg-quotes").split("\n").filter(q => q.trim().length > 0);

        this.currentConfig.discord.userId = this.getVal("cfg-discord-user-id");
        this.currentConfig.discord.autoSyncProfile = this.getCheck("cfg-discord-auto-sync");
        this.currentConfig.discord.showPresence = this.getCheck("cfg-discord-show-presence");

        this.currentConfig.theme.accentColor = this.getVal("cfg-theme-accent");
        this.currentConfig.theme.avatarEffect = this.getVal("cfg-avatar-effect");
        this.currentConfig.theme.usernameEffect = this.getVal("cfg-username-effect");
        this.currentConfig.theme.backgroundMode = this.getVal("cfg-theme-bg-mode");
        this.currentConfig.theme.backgroundImageUrl = this.getVal("cfg-theme-bg-img");
        this.currentConfig.theme.backgroundVideoUrl = this.getVal("cfg-theme-bg-vid");
        this.currentConfig.theme.scanlines = this.getCheck("cfg-theme-scanlines");
        this.currentConfig.theme.clickSound = this.getCheck("cfg-theme-click-sound");

        // Socials
        const socialRows = document.querySelectorAll(".cfg-social-row");
        const newSocials = [];
        socialRows.forEach(row => {
            const name = row.querySelector(".social-name").value.trim();
            const icon = row.querySelector(".social-icon").value.trim();
            const url = row.querySelector(".social-url").value.trim();
            if (name && url) {
                newSocials.push({ id: name.toLowerCase(), name, icon: icon || "fa-solid fa-link", url, color: "#fff" });
            }
        });
        if (newSocials.length > 0) this.currentConfig.socials = newSocials;
    }

    saveToLocalStorage() {
        this.collectCurrentForm();
        localStorage.setItem("anklabo_bio_custom_config", JSON.stringify(this.currentConfig));
        this.applyLiveChanges();

        if (typeof window.showBioToast === "function") {
            window.showBioToast("💾 Đã lưu cấu hình vào trình duyệt!");
        }
        this.closeConfigModal();
    }

    exportConfigFile() {
        this.collectCurrentForm();
        const content = `/**
 * =========================================================================
 * AnkLaBo Bio - Cấu hình trang cá nhân phong cách guns.lol & zyo.lol
 * Xuất ngày: ${new Date().toLocaleString()}
 * =========================================================================
 */

const CONFIG = ${JSON.stringify(this.currentConfig, null, 4)};

if (typeof window !== "undefined") {
    window.CONFIG = CONFIG;
}
`;
        const blob = new Blob([content], { type: "application/javascript" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "config.js";
        a.click();
        URL.revokeObjectURL(a.href);

        if (typeof window.showBioToast === "function") {
            window.showBioToast("📥 Đã tải file config.js mới!");
        }
    }

    resetConfig() {
        if (confirm("Bạn có chắc chắn muốn đặt lại toàn bộ cài đặt về mặc định ban đầu không?")) {
            localStorage.removeItem("anklabo_bio_custom_config");
            window.location.reload();
        }
    }

    getVal(id) { const el = document.getElementById(id); return el ? el.value : ""; }
    setVal(id, v) { const el = document.getElementById(id); if (el && v !== undefined) el.value = v; }
    getCheck(id) { const el = document.getElementById(id); return el ? el.checked : false; }
    setCheck(id, v) { const el = document.getElementById(id); if (el && v !== undefined) el.checked = !!v; }
}

if (typeof window !== "undefined") {
    window.ConfigPanel = ConfigPanel;
}
