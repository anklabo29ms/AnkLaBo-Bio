/**
 * Music Player & Multi-platform Audio Module for AnkLaBo Bio
 * Hỗ trợ:
 * 1. Phát nhạc qua link YouTube (Tự động trích xuất Video ID, Tiêu đề, Thumbnail qua oEmbed)
 * 2. Phát nhạc MP3/Audio trực tiếp kèm Web Audio API Visualizer
 * 3. Hỗ trợ Playlist nhiều bài (Lo-Fi / Remix Việt Nam) kèm nút Next (⏭) / Prev (⏮)
 */

class MusicPlayer {
    constructor(config) {
        this.config = config.music || {};
        this.playlist = this.config.playlist || [];
        this.currentIndex = this.config.currentTrackIndex || 0;

        this.audio = document.getElementById("audio-source");
        this.playBtn = document.getElementById("play-pause-btn");
        this.playIcon = this.playBtn ? this.playBtn.querySelector("i") : null;
        this.prevBtn = document.getElementById("player-prev-btn");
        this.nextBtn = document.getElementById("player-next-btn");
        this.progressBar = document.getElementById("player-progress");
        this.progressFill = document.getElementById("player-progress-fill");
        this.currentTimeEl = document.getElementById("player-current-time");
        this.durationEl = document.getElementById("player-duration");
        this.volumeSlider = document.getElementById("player-volume");
        this.muteBtn = document.getElementById("player-mute");
        this.canvas = document.getElementById("audio-visualizer");
        this.albumArt = document.querySelector(".player-cover img");
        this.trackCountEl = document.getElementById("player-track-count");

        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
        this.isVisualizerInit = false;
        this.animationFrameId = null;

        // YouTube Player State
        this.ytPlayer = null;
        this.isYTReady = false;
        this.currentMode = "direct"; // "direct" hoặc "youtube"
        this.ytPollInterval = null;

        this.init();
        this.initYouTubeAPI();
    }

    init() {
        if (!this.audio) return;

        // Tải bài hát đầu tiên
        if (this.playlist.length > 0) {
            this.loadTrack(this.playlist[this.currentIndex]);
        }

        // Âm lượng mặc định
        const defaultVol = this.config.volume !== undefined ? this.config.volume : 0.5;
        this.audio.volume = defaultVol;
        if (this.volumeSlider) this.volumeSlider.value = defaultVol * 100;

        // Sự kiện Audio Element
        this.audio.addEventListener("timeupdate", () => {
            if (this.currentMode === "direct") this.updateProgress();
        });
        this.audio.addEventListener("loadedmetadata", () => {
            if (this.currentMode === "direct" && this.durationEl) {
                this.durationEl.textContent = this.formatTime(this.audio.duration);
            }
        });
        this.audio.addEventListener("ended", () => this.nextTrack());

        // Các nút điều khiển
        if (this.playBtn) {
            this.playBtn.addEventListener("click", () => this.togglePlay());
        }
        if (this.prevBtn) {
            this.prevBtn.addEventListener("click", () => this.prevTrack());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener("click", () => this.nextTrack());
        }

        // Tua bài hát
        if (this.progressBar) {
            this.progressBar.addEventListener("click", (e) => this.seek(e));
        }

        // Âm lượng
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener("input", (e) => {
                const vol = e.target.value / 100;
                this.setVolume(vol);
            });
        }
        if (this.muteBtn) {
            this.muteBtn.addEventListener("click", () => this.toggleMute());
        }
    }

    /**
     * Khởi tạo YouTube Iframe API ngầm
     */
    initYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            this.setupYouTubePlayer();
        } else {
            window.onYouTubeIframeAPIReady = () => this.setupYouTubePlayer();
        }
    }

    setupYouTubePlayer() {
        let container = document.getElementById("yt-hidden-player");
        if (!container) {
            container = document.createElement("div");
            container.id = "yt-hidden-player";
            container.style.position = "absolute";
            container.style.width = "1px";
            container.style.height = "1px";
            container.style.top = "-9999px";
            container.style.left = "-9999px";
            container.style.opacity = "0";
            container.style.pointerEvents = "none";
            document.body.appendChild(container);
        }

        try {
            this.ytPlayer = new YT.Player("yt-hidden-player", {
                height: "100",
                width: "100",
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    rel: 0
                },
                events: {
                    onReady: () => { this.isYTReady = true; },
                    onStateChange: (e) => {
                        if (e.data === YT.PlayerState.ENDED) {
                            this.nextTrack();
                        }
                    }
                }
            });
        } catch (err) {
            console.warn("YouTube Player init:", err);
        }
    }

    /**
     * Trích xuất Video ID từ link YouTube bất kỳ
     */
    static extractYouTubeId(url) {
        if (!url) return null;
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regExp);
        return (match && match[1]) ? match[1] : null;
    }

    /**
     * Tự động lấy Tiêu đề và Ảnh bìa từ link YouTube qua noembed API
     */
    static async fetchTrackMetadata(url) {
        if (!url) return null;
        const ytId = MusicPlayer.extractYouTubeId(url);

        if (ytId) {
            try {
                const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
                if (res.ok) {
                    const data = await res.json();
                    return {
                        title: data.title || "YouTube Track",
                        artist: data.author_name || "YouTube Creator",
                        cover: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
                        src: `https://www.youtube.com/watch?v=${ytId}`,
                        type: "youtube",
                        youtubeId: ytId
                    };
                }
            } catch (e) {
                console.warn("Không thể fetch YouTube oEmbed:", e);
            }
            return {
                title: "YouTube Video",
                artist: "YouTube",
                cover: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
                src: url,
                type: "youtube",
                youtubeId: ytId
            };
        }

        // Link trực tiếp (.mp3, .wav, cdn)
        const filename = url.split("/").pop().split("?")[0].replace(/\.[^/.]+$/, "");
        return {
            title: decodeURIComponent(filename) || "Custom Audio Track",
            artist: "Audio Stream",
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
            src: url,
            type: "direct"
        };
    }

    loadTrack(track) {
        if (!track) return;

        const titleEl = document.querySelector(".player-title");
        const artistEl = document.querySelector(".player-artist");
        const coverEl = document.querySelector(".player-cover img");

        if (titleEl) titleEl.textContent = track.title || "Unknown Title";
        if (artistEl) artistEl.textContent = track.artist || "Unknown Artist";
        if (coverEl && track.cover) coverEl.src = track.cover;

        if (this.trackCountEl) {
            this.trackCountEl.textContent = `[ ${this.currentIndex + 1} / ${this.playlist.length} ]`;
        }

        // Kiểm tra loại nhạc: YouTube hay Direct Audio
        const ytId = track.youtubeId || MusicPlayer.extractYouTubeId(track.src);
        if (ytId) {
            this.currentMode = "youtube";
            this.audio.pause();
            if (this.isYTReady && this.ytPlayer && this.ytPlayer.loadVideoById) {
                this.ytPlayer.cueVideoById(ytId);
            }
        } else {
            this.currentMode = "direct";
            if (this.isYTReady && this.ytPlayer && this.ytPlayer.pauseVideo) {
                this.ytPlayer.pauseVideo();
            }
            if (track.src && this.audio.src !== track.src) {
                this.audio.src = track.src;
                this.audio.load();
            }
        }

        if (this.progressFill) this.progressFill.style.width = "0%";
        if (this.currentTimeEl) this.currentTimeEl.textContent = "00:00";
    }

    nextTrack() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack(this.playlist[this.currentIndex]);
        this.play();
    }

    prevTrack() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.playlist[this.currentIndex]);
        this.play();
    }

    togglePlay() {
        if (this.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    }

    isPlaying() {
        if (this.currentMode === "youtube") {
            return this.isYTReady && this.ytPlayer && this.ytPlayer.getPlayerState && this.ytPlayer.getPlayerState() === 1;
        }
        return !this.audio.paused;
    }

    async play() {
        this.updatePlayUI(true);

        if (this.currentMode === "youtube") {
            if (this.isYTReady && this.ytPlayer && this.ytPlayer.playVideo) {
                this.ytPlayer.playVideo();
                this.startYouTubeProgressPoll();
            }
            this.initSimulatedVisualizer();
        } else {
            if (this.audioContext && this.audioContext.state === "suspended") {
                await this.audioContext.resume();
            } else {
                this.initAudioContext();
            }
            try {
                await this.audio.play();
            } catch (e) {
                console.warn("Audio play:", e);
            }
        }
    }

    pause() {
        this.updatePlayUI(false);

        if (this.currentMode === "youtube") {
            if (this.isYTReady && this.ytPlayer && this.ytPlayer.pauseVideo) {
                this.ytPlayer.pauseVideo();
            }
            if (this.ytPollInterval) clearInterval(this.ytPollInterval);
        } else {
            this.audio.pause();
        }
    }

    updatePlayUI(isPlaying) {
        if (this.playIcon) {
            this.playIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
        }
        if (this.albumArt) {
            this.albumArt.classList.toggle("spinning", isPlaying);
        }
    }

    startYouTubeProgressPoll() {
        if (this.ytPollInterval) clearInterval(this.ytPollInterval);
        this.ytPollInterval = setInterval(() => {
            if (!this.isYTReady || !this.ytPlayer || !this.ytPlayer.getCurrentTime) return;
            const cur = this.ytPlayer.getCurrentTime();
            const dur = this.ytPlayer.getDuration();
            if (dur > 0) {
                const percent = (cur / dur) * 100;
                if (this.progressFill) this.progressFill.style.width = `${percent}%`;
                if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(cur);
                if (this.durationEl) this.durationEl.textContent = this.formatTime(dur);
            }
        }, 500);
    }

    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;

        if (this.currentMode === "youtube") {
            if (this.isYTReady && this.ytPlayer && this.ytPlayer.getDuration) {
                const dur = this.ytPlayer.getDuration();
                this.ytPlayer.seekTo(clickPos * dur, true);
            }
        } else {
            if (this.audio.duration) {
                this.audio.currentTime = clickPos * this.audio.duration;
            }
        }
    }

    setVolume(vol) {
        this.audio.volume = vol;
        if (this.isYTReady && this.ytPlayer && this.ytPlayer.setVolume) {
            this.ytPlayer.setVolume(vol * 100);
        }
        this.updateVolumeIcon(vol);
    }

    toggleMute() {
        if (this.currentMode === "youtube") {
            if (this.isYTReady && this.ytPlayer) {
                if (this.ytPlayer.isMuted()) {
                    this.ytPlayer.unMute();
                    this.updateVolumeIcon(1);
                } else {
                    this.ytPlayer.mute();
                    this.updateVolumeIcon(0);
                }
            }
        } else {
            this.audio.muted = !this.audio.muted;
            this.updateVolumeIcon(this.audio.muted ? 0 : this.audio.volume);
        }
    }

    updateProgress() {
        if (!this.audio.duration) return;
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.progressFill) this.progressFill.style.width = `${percent}%`;
        if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }

    updateVolumeIcon(vol) {
        if (!this.muteBtn) return;
        const icon = this.muteBtn.querySelector("i");
        if (!icon) return;

        icon.className = "fa-solid";
        if (vol === 0) icon.classList.add("fa-volume-xmark");
        else if (vol < 0.5) icon.classList.add("fa-volume-low");
        else icon.classList.add("fa-volume-high");
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Web Audio API Analyser Visualizer
     */
    initAudioContext() {
        if (this.isVisualizerInit) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            this.audioContext = new AudioCtx();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64;
            this.analyser.smoothingTimeConstant = 0.8;

            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.isVisualizerInit = true;
            this.renderVisualizer();
        } catch (err) {
            console.warn("Visualizer Web Audio:", err);
        }
    }

    initSimulatedVisualizer() {
        if (this.isVisualizerInit) return;
        this.isVisualizerInit = true;
        this.renderSimulatedVisualizer();
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

            const barCount = 28;
            const barWidth = (width / barCount) - 2;
            let x = 0;
            const accent = (window.CONFIG && window.CONFIG.theme && window.CONFIG.theme.accentColor) || "#8b5cf6";

            for (let i = 0; i < barCount; i++) {
                const val = this.dataArray[i] || 0;
                const percent = val / 255;
                const barHeight = Math.max(3, percent * height * 0.92);

                const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
                grad.addColorStop(0, accent);
                grad.addColorStop(1, "#c084fc");

                ctx.fillStyle = grad;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 2;
            }
        };
        draw();
    }

    renderSimulatedVisualizer() {
        if (!this.canvas) return;
        const ctx = this.canvas.getContext("2d");
        const width = this.canvas.width;
        const height = this.canvas.height;

        const draw = () => {
            this.animationFrameId = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, width, height);

            const isPlay = this.isPlaying();
            const barCount = 28;
            const barWidth = (width / barCount) - 2;
            let x = 0;
            const accent = (window.CONFIG && window.CONFIG.theme && window.CONFIG.theme.accentColor) || "#8b5cf6";

            for (let i = 0; i < barCount; i++) {
                const rand = isPlay ? Math.random() * 0.8 + 0.2 : 0.08;
                const barHeight = Math.max(3, rand * height * 0.85);

                const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
                grad.addColorStop(0, accent);
                grad.addColorStop(1, "#c084fc");

                ctx.fillStyle = grad;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 2;
            }
        };
        draw();
    }
}

if (typeof window !== "undefined") {
    window.MusicPlayer = MusicPlayer;
}
