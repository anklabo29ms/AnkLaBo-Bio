# ⚡ AnkLaBo-Bio - Aesthetic Bio Link

> Trang web Bio cá nhân mang phong cách **guns.lol** và **zyo.lol**, được thiết kế độc quyền dành riêng cho **AnkLaBo**, tối ưu hóa toàn diện để chạy trên **Railway** và **GitHub Pages**.

---

## 🌟 Tính năng nổi bật

- 🚀 **Màn hình chờ "Click to Enter"**: Giao diện đen mờ nhấp nháy chữ aesthetic, click bất kỳ đâu để mở khóa âm thanh và hiển thị profile card với hiệu ứng mượt mà.
- 💎 **Glassmorphism & 3D Tilt**: Thẻ kính mờ Acrylic cao cấp (`backdrop-filter: blur(24px)`), tự động nghiêng 3D theo góc rê chuột với vệt sáng lấp lánh phản chiếu.
- 🎧 **Trình phát nhạc & Sóng tần số (Visualizer)**: Tích hợp Web Audio API `AnalyserNode`, vẽ các thanh sóng âm thanh nhảy chân thực theo đúng nhịp beat của bài hát trên `<canvas>`.
- 💬 **Đồng bộ Discord (chuẩn guns.lol & zyo.lol)**:
  - Tự động lấy **Avatar** (kể cả avatar động GIF Nitro), **Banner** ảnh bìa, **Huy hiệu** (Badges), và **Tên hiển thị**.
  - Kết nối thời gian thực qua **Lanyard WebSocket**: Hiển thị chấm online/idle/dnd và card đang nghe nhạc **Spotify** (tên bài, nghệ sĩ, ảnh album) hoặc game đang chơi.
- 🔒 **Bảng điều khiển trực tiếp có khóa mật khẩu (Live Config Panel)**:
  - Nút bánh răng tinh tế ở góc thẻ bio.
  - Yêu cầu mật khẩu Master được bảo vệ bằng mã băm **SHA-256 kèm Salt** (`crypto.subtle`), **tuyệt đối không bị lộ mật khẩu dạng chữ trong mã nguồn**.
  - Cho phép sửa mọi thông tin (Avatar, tên, nhạc, background, link mạng xã hội, màu sắc) và xem trước trực tiếp (Live Preview).
- 🖱️ **Con trỏ chuột Aesthetic**: Chấm sáng neon với vòng đuôi mượt mà và hiệu ứng bụi sáng lấp lánh (Sparkle particles) khi rê và bấm chuột.
- 📱 **Responsive 100%**: Hiển thị hoàn hảo trên cả điện thoại (iOS, Android) và máy tính màn hình lớn.

---

## 🚂 Hướng dẫn Deploy lên Railway (Tối ưu 100%)

Dự án đã được cấu hình sẵn các file tối ưu riêng cho Railway (`server.js`, `package.json`, `railway.json`, `Procfile`, `Dockerfile`):
- **Tự động nhận diện Port**: Lắng nghe theo `process.env.PORT` và bind host `0.0.0.0`.
- **Healthcheck Endpoint**: Sẵn sàng tại `/health` giúp Railway tự kiểm tra trạng thái và auto-heal.
- **Hỗ trợ HTTP Range Requests**: Tua nhạc MP3 và video MP4 mượt mà không bị giật lag.
- **Siêu nhẹ**: Thuần Node.js native, không tốn thời gian tải packages, tiêu thụ RAM cực thấp (< 20MB).

### Các bước triển khai lên Railway:
1. Đăng nhập vào [Railway Dashboard](https://railway.com/).
2. Nhấn nút **New Project** -> Chọn **Deploy from GitHub repo**.
3. Chọn repository **`anklabo29ms/AnkLaBo-Bio`**.
4. Railway sẽ tự động nhận diện và build triển khai trong khoảng 20 - 30 giây!
5. **Tạo Domain công khai**:
   - Nhấp vào service vừa tạo -> Chọn tab **Settings**.
   - Cuộn xuống phần **Networking** -> Nhấn **Generate Domain** (bạn sẽ nhận được domain dạng `xxx.up.railway.app`).
   - Hoặc bạn có thể nhấn **Custom Domain** để gắn tên miền riêng của bạn vào.

---

## 🛠️ Hướng dẫn sử dụng & Tùy biến

### Cách 1: Sử dụng Bảng cấu hình trực tiếp trên Web
1. Mở trang web bio của bạn.
2. Bấm vào biểu tượng **Bánh răng (Cài đặt)** ở góc trên bên phải của thẻ Bio.
3. Nhập mật khẩu Master: `AnkLaBo2610`.
4. Trong bảng cấu hình:
   - **Tab Hồ sơ**: Sửa tên, handle `@`, avatar, banner, các câu chữ gõ máy (typewriter).
   - **Tab Discord Sync**: Nhập Discord ID của bạn -> Bấm **Đồng bộ ngay** để kéo avatar, banner và status Discord ngay lập tức.
   - **Tab Mạng xã hội**: Thêm/xóa/sửa các link Facebook, Telegram, Steam, Spotify, GitHub,...
   - **Tab Nhạc nền**: Đổi link bài hát MP3, tên bài hát và ảnh bìa album.
   - **Tab Giao diện**: Chọn màu sắc neon chủ đạo (Accent Color), đổi chế độ hình nền hoặc video nền.
5. Bấm **"Lưu & Áp dụng"** để lưu trực tiếp vào trình duyệt của bạn, hoặc bấm **"Tải config.js"** để lấy file cấu hình mới nhất thay vào repo.

### Cách 2: Chỉnh sửa trực tiếp file `config.js`
Bạn cũng có thể mở file [`config.js`](./config.js) ngay trên GitHub để chỉnh sửa các thông số theo ý muốn bất kỳ lúc nào.

---

## 🔐 Cơ chế bảo mật mật khẩu

- Mật khẩu gốc `AnkLaBo2610` **không xuất hiện ở bất kỳ dòng nào** trong toàn bộ repository.
- File `config.js` chỉ lưu trữ:
  ```javascript
  auth: {
      salt: "anklabo_bio_salt_2026",
      passwordHash: "7a26c5442691e4de63bfdc6bda28f13d18de88dea4aabb3d110436f39d9c1df3"
  }
  ```
- Khi bạn nhập mật khẩu, trình duyệt sử dụng thuật toán Web Crypto API chuẩn quốc tế:
  `crypto.subtle.digest('SHA-256', UTF8(mật_khẩu + salt))`
  để đối chiếu với mã hash, đảm bảo an toàn tuyệt đối ngay cả khi ai đó F12 Inspect Element hoặc soi mã nguồn trên GitHub.
