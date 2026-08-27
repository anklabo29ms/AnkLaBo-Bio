/**
 * AnkLaBo Bio - Optimized Production Server for Railway
 * Tối ưu hóa toàn diện:
 * - Hệ thống đếm VIEW THẬT (Real View Counter) lưu vào data/views.json
 * - Lọc IP chống spam F5 liên tục trong 15 phút
 * - Hỗ trợ process.env.PORT và bind 0.0.0.0
 * - Endpoint healthcheck /health cho Railway auto-healing
 * - Hỗ trợ HTTP Range Requests cho phát file nhạc MP3/MP4 tua thời gian mượt mà
 * - Tự động nhận diện MIME types chuẩn
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = "0.0.0.0";
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, "data");
const VIEWS_FILE = path.join(DATA_DIR, "views.json");

// Đảm bảo thư mục data tồn tại
if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

// Khởi tạo views database đơn giản nhưng cực kỳ chính xác
let viewData = { views: 1337, ips: {} };
if (fs.existsSync(VIEWS_FILE)) {
    try {
        viewData = JSON.parse(fs.readFileSync(VIEWS_FILE, "utf-8"));
    } catch (e) {
        console.error("Không thể đọc views.json, dùng mặc định:", e);
    }
} else {
    try {
        fs.writeFileSync(VIEWS_FILE, JSON.stringify(viewData, null, 2));
    } catch (e) {}
}

function saveViews() {
    try {
        fs.writeFileSync(VIEWS_FILE, JSON.stringify(viewData, null, 2));
    } catch (e) {
        console.error("Lỗi khi ghi views.json:", e);
    }
}

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

    // 2. API Đếm View Thật (Real View Counter)
    if (req.url.startsWith("/api/views")) {
        const clientIp = req.headers["x-forwarded-for"] 
            ? req.headers["x-forwarded-for"].split(",")[0].trim() 
            : req.socket.remoteAddress || "unknown";

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            res.writeHead(204);
            return res.end();
        }

        if (req.method === "POST") {
            const now = Date.now();
            const lastVisit = viewData.ips[clientIp] || 0;
            const cooldown = 15 * 60 * 1000; // 15 phút mỗi IP để chống spam F5

            let isNew = false;
            if (now - lastVisit > cooldown) {
                viewData.views = (viewData.views || 0) + 1;
                viewData.ips[clientIp] = now;
                isNew = true;

                // Dọn dẹp IP cũ hơn 24h
                const oneDayAgo = now - 24 * 60 * 60 * 1000;
                for (const ip in viewData.ips) {
                    if (viewData.ips[ip] < oneDayAgo) {
                        delete viewData.ips[ip];
                    }
                }

                saveViews();
            }

            res.writeHead(200);
            return res.end(JSON.stringify({
                views: viewData.views,
                isNew: isNew
            }));
        }

        // GET request chỉ xem số view
        res.writeHead(200);
        return res.end(JSON.stringify({ views: viewData.views }));
    }

    // 3. Static File Server
    let reqPath = decodeURI(req.url.split("?")[0]);
    if (reqPath === "/") reqPath = "/index.html";

    const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(PUBLIC_DIR, safePath);

    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("403 Forbidden");
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
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

    const headers = {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Access-Control-Allow-Origin": "*"
    };

    if (ext === ".html" || ext === ".json" || filePath.endsWith("config.js")) {
        headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    } else {
        headers["Cache-Control"] = "public, max-age=86400";
    }

    // Range Request cho streaming Audio/Video
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
    console.log(`📊 Real View Counter API: http://${HOST}:${PORT}/api/views`);
});

process.on("SIGTERM", () => {
    console.log("SIGTERM nhận được. Đang đóng server...");
    saveViews();
    server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
    console.log("SIGINT nhận được. Đang đóng server...");
    saveViews();
    server.close(() => process.exit(0));
});
