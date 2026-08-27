/**
 * AnkLaBo Bio - Optimized Production Server for Railway
 * Tối ưu hóa toàn diện cho Railway:
 * - Hỗ trợ process.env.PORT và bind 0.0.0.0
 * - Endpoint healthcheck /health cho Railway auto-healing
 * - Hỗ trợ HTTP Range Requests cho phát file nhạc MP3/MP4 tua thời gian mượt mà
 * - Tự động nhận diện MIME types chuẩn
 * - Không cần npm install dependencies (chạy thuần Node.js cực nhẹ, <20MB RAM)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = "0.0.0.0";
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject"
};

const server = http.createServer((req, res) => {
    // 1. Healthcheck endpoint cho Railway
    if (req.url === "/health" || req.url === "/healthz") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            status: "healthy",
            app: "AnkLaBo-Bio",
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        }));
    }

    // 2. Parse URL & Sanitize path để chống Directory Traversal
    let reqPath = decodeURI(req.url.split("?")[0]);
    if (reqPath === "/") reqPath = "/index.html";

    const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(PUBLIC_DIR, safePath);

    // Đảm bảo request không vượt ra ngoài thư mục dự án
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("403 Forbidden");
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback về index.html cho các route SPA
            return serveStaticFile(path.join(PUBLIC_DIR, "index.html"), req, res);
        }
        serveStaticFile(filePath, req, res, stats);
    });
});

function serveStaticFile(filePath, req, res, stats) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    const stat = stats || fs.statSync(filePath);
    const totalSize = stat.size;

    // Security Headers
    const headers = {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Access-Control-Allow-Origin": "*"
    };

    // Cache control: assets cache dài, html/config cache ngắn
    if (ext === ".html" || ext === ".json" || filePath.endsWith("config.js")) {
        headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    } else {
        headers["Cache-Control"] = "public, max-age=86400"; // 1 ngày
    }

    // 3. Xử lý Range Request (Cực kỳ quan trọng để phát nhạc MP3/MP4 tua bài mượt mà trên trình duyệt)
    const range = req.headers.range;
    if (range && (ext === ".mp3" || ext === ".mp4" || ext === ".wav")) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

        if (start >= totalSize || end >= totalSize || start > end) {
            headers["Content-Range"] = `bytes */${totalSize}`;
            res.writeHead(416, headers);
            return res.end();
        }

        const chunksize = end - start + 1;
        headers["Content-Range"] = `bytes ${start}-${end}/${totalSize}`;
        headers["Accept-Ranges"] = "bytes";
        headers["Content-Length"] = chunksize;

        res.writeHead(206, headers);
        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
    } else {
        headers["Content-Length"] = totalSize;
        headers["Accept-Ranges"] = "bytes";
        res.writeHead(200, headers);
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    }
}

server.listen(PORT, HOST, () => {
    console.log(`⚡ AnkLaBo Bio Server đang chạy trên Railway: http://${HOST}:${PORT}`);
    console.log(`🩺 Healthcheck: http://${HOST}:${PORT}/health`);
});

// Xử lý tín hiệu tắt an toàn từ Railway
process.on("SIGTERM", () => {
    console.log("Nhận tín hiệu SIGTERM từ Railway. Đang đóng server...");
    server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
    console.log("Nhận tín hiệu SIGINT. Đang đóng server...");
    server.close(() => process.exit(0));
});
