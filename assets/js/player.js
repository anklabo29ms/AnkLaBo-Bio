/**
 * Music Player & Audio Visualizer Module for AnkLaBo Bio
 * Tích hợp Web Audio API (AnalyserNode) để vẽ sóng tần số nhảy theo nhạc
 */

class MusicPlayer {
    constructor(config) {
        this.config = config.music || {};
        this.audio = document.getElementById("audio-source");
        this.playBtn = document.getElementById("play-pause-btn");
        this.playIcon = this.playBtn ? this.playBtn.querySelector("i") : null;
        this.progressBar = document.getElementById("player-progress");
        this.progressFill = document.getElementById("player-progress-fill");
        this.currentTimeEl = document.getElementById("player-current-time");
        this.durationEl = document.getElementById("player-duration");
        this.volumeSlider = document.getElementById("player-volume");
        this.muteBtn = document.getElementById("player-mute");
        this.canvas = document.getElementById("audio-visualizer");
        this.albumArt = document.querySelector(".player-cover img");

        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
        this.isVisualizerInit = false;
        this.animationFrameId = null;

        this.init();
    }

    init() {
        if (!this.audio) return;

        // Cập nhật thông tin bài hát ban đầu
        this.loadTrack(this.config);

        // Thiết lập âm lượng mặc định
        this.audio.volume = this.config.volume !== undefined ? this.config.volume : 0.5;
        if (this.volumeSlider) {
            this.volumeSlider.value = this.audio.volume * 100;
        }

        // Sự kiện audio
        this.audio.addEventListener("timeupdate", () => this.updateProgress());
        this.audio.addEventListener("loadedmetadata", () => {
            if (this.durationEl) {
                this.durationEl.textContent = this.formatTime(this.audio.duration);
            }
        });
        this.audio.addEventListener("ended", () => {
            // Lặp lại bài hát
            this.audio.currentTime = 0;
            this.play();
        });

        // Nút Play / Pause
        if (this.playBtn) {
            this.playBtn.addEventListener("click", () => this.togglePlay());
        }

        // Thanh tiến trình
        if (this.progressBar) {
            this.progressBar.addEventListener("click", (e) => this.seek(e));
        }

        // Thanh âm lượng
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener("input", (e) => {
                const vol = e.target.value / 100;
                this.audio.volume = vol;
                this.updateVolumeIcon(vol);
            });
        }

        // Nút Mute
        if (this.muteBtn) {
            this.muteBtn.addEventListener("click", () => {
                this.audio.muted = !this.audio.muted;
                this.updateVolumeIcon(this.audio.muted ? 0 : this.audio.volume);
            });
        }
    }

    loadTrack(musicConfig) {
        if (!musicConfig) return;
        this.config = musicConfig;

        const titleEl = document.querySelector(".player-title");
        const artistEl = document.querySelector(".player-artist");
        const coverEl = document.querySelector(".player-cover img");

        if (titleEl) titleEl.textContent = musicConfig.title || "Unknown Title";
        if (artistEl) artistEl.textContent = musicConfig.artist || "Unknown Artist";
        if (coverEl && musicConfig.cover) coverEl.src = musicConfig.cover;

        if (musicConfig.src && this.audio.src !== musicConfig.src) {
            this.audio.src = musicConfig.src;
            this.audio.load();
        }
    }

    initAudioContext() {
        if (this.isVisualizerInit) return;

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            this.audioContext = new AudioCtx();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64; // Số lượng dải tần (32 bars)
            this.analyser.smoothingTimeConstant = 0.8;

            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            this.isVisualizerInit = true;
            this.renderVisualizer();
        } catch (err) {
            console.warn("Không thể khởi tạo Web Audio API Visualizer:", err);
        }
    }

    renderVisualizer() {
        if (!this.canvas || !this.analyser) return;

        const ctx = this.canvas.getContext("2d");
        const width = this.canvas.width;
        const height = this.canvas.height;

        const draw = () => {
            this.animationFrameId = requestAnimationFrame(draw);

            this.analyser.getByteFrequencyData(this.dataArray);
            ctx.clearRect(0, 0, width, height);

            const barCount = 24;
            const barWidth = (width / barCount) - 2;
            let x = 0;

            const accentColor = (window.CONFIG && window.CONFIG.theme && window.CONFIG.theme.accentColor) 
                ? window.CONFIG.theme.accentColor 
                : "#8b5cf6";

            for (let i = 0; i < barCount; i++) {
                // Lấy giá trị tần số
                const value = this.dataArray[i] || 0;
                const percent = value / 255;
                const barHeight = Math.max(3, percent * height * 0.9);

                // Gradient màu cho thanh sóng
                const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                gradient.addColorStop(0, accentColor);
                gradient.addColorStop(1, "#c084fc");

                ctx.fillStyle = gradient;
                
                // Bo góc cho đỉnh thanh sóng
                this.drawRoundedRect(ctx, x, height - barHeight, barWidth, barHeight, 2);

                x += barWidth + 2;
            }
        };

        draw();
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }

    togglePlay() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    async play() {
        if (this.audioContext && this.audioContext.state === "suspended") {
            await this.audioContext.resume();
        } else {
            this.initAudioContext();
        }

        try {
            await this.audio.play();
            if (this.playIcon) {
                this.playIcon.classList.remove("fa-play");
                this.playIcon.classList.add("fa-pause");
            }
            if (this.albumArt) {
                this.albumArt.classList.add("spinning");
            }
        } catch (e) {
            console.warn("Autoplay bị chặn hoặc đang chờ tương tác:", e);
        }
    }

    pause() {
        this.audio.pause();
        if (this.playIcon) {
            this.playIcon.classList.remove("fa-pause");
            this.playIcon.classList.add("fa-play");
        }
        if (this.albumArt) {
            this.albumArt.classList.remove("spinning");
        }
    }

    updateProgress() {
        if (!this.audio.duration) return;
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${percent}%`;
        }
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    seek(e) {
        if (!this.audio.duration) return;
        const rect = this.progressBar.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = clickPos * this.audio.duration;
    }

    updateVolumeIcon(vol) {
        if (!this.muteBtn) return;
        const icon = this.muteBtn.querySelector("i");
        if (!icon) return;

        icon.className = "fa-solid";
        if (vol === 0) {
            icon.classList.add("fa-volume-xmark");
        } else if (vol < 0.5) {
            icon.classList.add("fa-volume-low");
        } else {
            icon.classList.add("fa-volume-high");
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

if (typeof window !== "undefined") {
    window.MusicPlayer = MusicPlayer;
}
