/**
 * Auth & Crypto Module for AnkLaBo Bio
 * Bảo mật tuyệt đối:
 * - Sử dụng Web Crypto API (SHA-256 + Salt)
 * - Mật khẩu gốc không bao giờ được lưu dưới dạng plain text
 * - Cơ chế In-Memory: F5 hoặc tải lại trang web là lập tức reset quyền quản trị
 */

class BioAuth {
    constructor(config) {
        this.config = (config && config.auth) ? config.auth : {};
        // Tuyệt đối không lưu vào sessionStorage/localStorage để đảm bảo F5 là reset
        this.isAuthenticated = false;
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
            this.isAuthenticated = true; // Chỉ lưu trong RAM phiên hiện tại
        }
        return valid;
    }

    /**
     * Đăng xuất phiên cấu hình
     */
    logout() {
        this.isAuthenticated = false;
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
