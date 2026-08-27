/**
 * Live Config Panel & Password Modal Controller for AnkLaBo Bio
 * Cho phép chỉnh sửa cấu hình trực tiếp với mật khẩu bảo vệ tuyệt đối
 */

class ConfigPanel {
    constructor(auth, discordManager, musicPlayer) {
        this.auth = auth;
        this.discordManager = discordManager;
        this.musicPlayer = musicPlayer;

        this.currentConfig = JSON.parse(JSON.stringify(window.CONFIG));
        this.loadLocalConfig();

        this.initDOMElements();
        this.bindEvents();
    }

    initDOMElements() {
        // Nút mở config
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

        // Discord actions trong config
        this.discordSyncBtn = document.getElementById("cfg-discord-sync-btn");
        this.discordOAuthBtn = document.getElementById("cfg-discord-oauth-btn");
    }

    bindEvents() {
        if (this.configBtn) {
            this.configBtn.addEventListener("click", () => this.handleOpenConfig());
        }

        // Xử lý xác thực mật khẩu
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

        // Đóng modal config
        if (this.cfgClose) {
            this.cfgClose.addEventListener("click", () => this.closeConfigModal());
        }

        // Chuyển tab trong bảng config
        this.tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-tab");
                this.switchTab(targetTab);
            });
        });

        // Nút Discord Sync
        if (this.discordSyncBtn) {
            this.discordSyncBtn.addEventListener("click", () => this.handleDiscordManualSync());
        }
        if (this.discordOAuthBtn) {
            this.discordOAuthBtn.addEventListener("click", () => {
                const clientId = document.getElementById("cfg-discord-client-id").value.trim();
                this.discordManager.loginWithDiscord(clientId);
            });
        }

        // Nút lưu & xuất file
        if (this.saveLocalBtn) {
            this.saveLocalBtn.addEventListener("click", () => this.saveToLocalStorage());
        }
        if (this.exportBtn) {
            this.exportBtn.addEventListener("click", () => this.exportConfigFile());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener("click", () => this.resetConfig());
        }

        // Live update khi người dùng gõ
        this.bindLiveFormInputs();
    }

    loadLocalConfig() {
        const saved = localStorage.getItem("anklabo_bio_custom_config");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.currentConfig = Object.assign({}, this.currentConfig, parsed);
                window.CONFIG = this.currentConfig;
            } catch (e) {
                console.error("Lỗi khi load custom config:", e);
            }
        }
    }

    handleOpenConfig() {
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
                window.showBioToast("🔓 Mở khóa bảng cấu hình thành công!");
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

        // Discord
        this.setVal("cfg-discord-user-id", cfg.discord.userId);
        this.setVal("cfg-discord-client-id", cfg.auth.discordClientId);
        this.setCheck("cfg-discord-auto-sync", cfg.discord.autoSyncProfile);
        this.setCheck("cfg-discord-show-presence", cfg.discord.showPresence);

        // Music
        this.setVal("cfg-music-title", cfg.music.title);
        this.setVal("cfg-music-artist", cfg.music.artist);
        this.setVal("cfg-music-cover", cfg.music.cover);
        this.setVal("cfg-music-src", cfg.music.src);

        // Theme
        this.setVal("cfg-theme-accent", cfg.theme.accentColor);
        this.setVal("cfg-theme-bg-mode", cfg.theme.backgroundMode);
        this.setVal("cfg-theme-bg-img", cfg.theme.backgroundImageUrl);
        this.setVal("cfg-theme-bg-vid", cfg.theme.backgroundVideoUrl);

        // Social links list editor
        this.renderSocialListEditor();
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

        // Gán sự kiện xóa
        container.querySelectorAll(".btn-del-social").forEach(btn => {
            btn.addEventListener("click", (e) => {
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
        listen("cfg-theme-accent", "input", (e) => {
            this.currentConfig.theme.accentColor = e.target.value;
            this.applyLiveChanges();
        });
        listen("cfg-music-title", "input", (e) => {
            this.currentConfig.music.title = e.target.value;
            if (this.musicPlayer) this.musicPlayer.loadTrack(this.currentConfig.music);
        });
        listen("cfg-music-artist", "input", (e) => {
            this.currentConfig.music.artist = e.target.value;
            if (this.musicPlayer) this.musicPlayer.loadTrack(this.currentConfig.music);
        });
    }

    applyLiveChanges() {
        window.CONFIG = this.currentConfig;
        if (typeof window.renderBioProfile === "function") {
            window.renderBioProfile(this.currentConfig);
        }
        // Cập nhật màu CSS variables
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
            alert("Không thể kết nối Discord User ID này. Hãy chắc chắn bạn đã tham gia server Lanyard (discord.gg/lanyard) hoặc ID chính xác.");
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
        this.currentConfig.auth.discordClientId = this.getVal("cfg-discord-client-id");
        this.currentConfig.discord.autoSyncProfile = this.getCheck("cfg-discord-auto-sync");
        this.currentConfig.discord.showPresence = this.getCheck("cfg-discord-show-presence");

        this.currentConfig.music.title = this.getVal("cfg-music-title");
        this.currentConfig.music.artist = this.getVal("cfg-music-artist");
        this.currentConfig.music.cover = this.getVal("cfg-music-cover");
        this.currentConfig.music.src = this.getVal("cfg-music-src");

        this.currentConfig.theme.accentColor = this.getVal("cfg-theme-accent");
        this.currentConfig.theme.backgroundMode = this.getVal("cfg-theme-bg-mode");
        this.currentConfig.theme.backgroundImageUrl = this.getVal("cfg-theme-bg-img");
        this.currentConfig.theme.backgroundVideoUrl = this.getVal("cfg-theme-bg-vid");

        // Đọc social list
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
        if (this.musicPlayer) this.musicPlayer.loadTrack(this.currentConfig.music);

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
            localStorage.removeItem("anklabo_discord_synced_profile");
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
