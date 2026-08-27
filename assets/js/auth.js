/**
 * Auth & Crypto Module for AnkLaBo Bio
 * Bảo mật tuyệt đối: Sử dụng Web Crypto API (SHA-256 + Salt)
 * Mật khẩu gốc không bao giờ được lưu dưới dạng plain text.
 */

class BioAuth {
    constructor(config) {
        this.config = (config && config.auth) ? config.auth : {};
        this.isAuthenticated = false;
        this.checkSession();
    }

    /**
     * Băm chuỗi văn bản bằng SHA-256 chuẩn Web Crypto
     */
    async sha256(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Kiểm tra mật khẩu người dùng nhập vào
     */
    async verify(password) {
        if (!password) return false;
        const salt = this.config.salt || "";
        const computedHash = await this.sha256(password + salt);
        
        const valid = (computedHash === this.config.passwordHash);
        if (valid) {
            this.isAuthenticated = true;
            sessionStorage.setItem("anklabo_auth_session", "true");
        }
        return valid;
    }

    /**
     * Kiểm tra phiên đăng nhập hiện tại trong tab
     */
    checkSession() {
        if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("anklabo_auth_session") === "true") {
            this.isAuthenticated = true;
        }
    }

    /**
     * Đăng xuất phiên cấu hình
     */
    logout() {
        this.isAuthenticated = false;
        if (typeof sessionStorage !== "undefined") {
            sessionStorage.removeItem("anklabo_auth_session");
        }
    }

    /**
     * Tạo mã băm mới khi đổi mật khẩu
     */
    async generateNewHash(newPassword, salt = (this.config.salt || "")) {
        return await this.sha256(newPassword + salt);
    }
}

if (typeof window !== "undefined") {
    window.BioAuth = BioAuth;
}
