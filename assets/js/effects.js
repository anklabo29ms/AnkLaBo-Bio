/**
 * Effects Engine for AnkLaBo Bio (guns.lol & zyo.lol Aesthetic)
 * Chứa các bộ hiệu ứng:
 * 1. Background Canvas: Starfield Warp, Matrix Rain, Snowfall, Cyber Embers
 * 2. Web Audio UI Sound Synthesizer: Mechanical / Cyber Click sound
 * 3. CRT Scanlines & Screen FX
 */

class EffectsEngine {
    constructor() {
        this.canvas = document.getElementById("bg-canvas");
        this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
        this.currentMode = "starfield";
        this.animationId = null;
        this.particles = [];
        this.width = 0;
        this.height = 0;
        this.audioCtx = null;

        if (this.canvas) {
            this.initCanvas();
        }
    }

    initCanvas() {
        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.initParticles(this.currentMode);
    }

    setEffect(mode) {
        this.currentMode = mode || "starfield";
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.initParticles(this.currentMode);
        this.startAnimation();
    }

    initParticles(mode) {
        this.particles = [];
        const accent = (window.CONFIG && window.CONFIG.theme && window.CONFIG.theme.accentColor) || "#8b5cf6";

        if (mode === "starfield") {
            const count = Math.min(180, Math.floor((this.width * this.height) / 8000));
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: (Math.random() - 0.5) * this.width * 2,
                    y: (Math.random() - 0.5) * this.height * 2,
                    z: Math.random() * this.width,
                    pz: 0
                });
            }
        } else if (mode === "matrix") {
            const fontSize = 14;
            const columns = Math.floor(this.width / fontSize);
            this.matrixDrops = [];
            for (let i = 0; i < columns; i++) {
                this.matrixDrops[i] = Math.floor(Math.random() * -50);
            }
        } else if (mode === "snow") {
            const count = Math.min(100, Math.floor((this.width * this.height) / 10000));
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    radius: Math.random() * 2.5 + 0.8,
                    speedY: Math.random() * 1.2 + 0.6,
                    speedX: Math.random() * 0.6 - 0.3,
                    alpha: Math.random() * 0.6 + 0.3,
                    swing: Math.random() * Math.PI * 2
                });
            }
        } else if (mode === "embers") {
            const count = Math.min(80, Math.floor((this.width * this.height) / 12000));
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    radius: Math.random() * 2 + 1,
                    speedY: -(Math.random() * 1.5 + 0.5),
                    speedX: (Math.random() - 0.5) * 0.8,
                    alpha: Math.random() * 0.7 + 0.3,
                    life: Math.random() * 100
                });
            }
        }
    }

    startAnimation() {
        const loop = () => {
            this.animationId = requestAnimationFrame(loop);
            this.draw();
        };
        loop();
    }

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const accent = (window.CONFIG && window.CONFIG.theme && window.CONFIG.theme.accentColor) || "#8b5cf6";

        if (this.currentMode === "starfield") {
            ctx.fillStyle = "rgba(9, 9, 11, 0.35)";
            ctx.fillRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                p.pz = p.z;
                p.z -= 4;

                if (p.z <= 0) {
                    p.x = (Math.random() - 0.5) * w * 2;
                    p.y = (Math.random() - 0.5) * h * 2;
                    p.z = w;
                    p.pz = p.z;
                }

                const k = 250 / p.z;
                const px = p.x * k + cx;
                const py = p.y * k + cy;

                const prevK = 250 / p.pz;
                const prevPx = p.x * prevK + cx;
                const prevPy = p.y * prevK + cy;

                if (px >= 0 && px <= w && py >= 0 && py <= h) {
                    const size = Math.max(0.5, (1 - p.z / w) * 2.2);
                    ctx.beginPath();
                    ctx.moveTo(prevPx, prevPy);
                    ctx.lineTo(px, py);
                    ctx.strokeStyle = `rgba(216, 180, 254, ${(1 - p.z / w) * 0.9})`;
                    ctx.lineWidth = size;
                    ctx.stroke();
                }
            }
        } else if (this.currentMode === "matrix") {
            ctx.fillStyle = "rgba(9, 9, 11, 0.12)";
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = accent;
            ctx.font = "14px 'JetBrains Mono', monospace";

            const chars = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ1234567890ABCDEF";
            for (let i = 0; i < this.matrixDrops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * 14;
                const y = this.matrixDrops[i] * 14;

                // Chữ sáng ở đầu dòng
                ctx.fillStyle = "#ffffff";
                ctx.fillText(text, x, y);

                ctx.fillStyle = accent;
                ctx.fillText(text, x, y - 14);

                if (y > h && Math.random() > 0.975) {
                    this.matrixDrops[i] = 0;
                }
                this.matrixDrops[i]++;
            }
        } else if (this.currentMode === "snow") {
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                p.y += p.speedY;
                p.swing += 0.02;
                p.x += Math.sin(p.swing) * 0.5 + p.speedX;

                if (p.y > h) {
                    p.y = -10;
                    p.x = Math.random() * w;
                }
                if (p.x > w) p.x = 0;
                if (p.x < 0) p.x = w;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.shadowBlur = 4;
                ctx.shadowColor = "#ffffff";
                ctx.fill();
            }
        } else if (this.currentMode === "embers") {
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                p.y += p.speedY;
                p.x += p.speedX + Math.sin(p.life * 0.05) * 0.3;
                p.life += 1;

                if (p.y < -10) {
                    p.y = h + 10;
                    p.x = Math.random() * w;
                    p.life = 0;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = accent;
                ctx.shadowBlur = 10;
                ctx.shadowColor = accent;
                ctx.fill();
            }
        }
    }

    /**
     * Bộ tạo âm thanh click UI bằng Web Audio API thuần
     */
    playClick() {
        if (!window.CONFIG || !window.CONFIG.theme || window.CONFIG.theme.clickSound === false) return;

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!this.audioCtx) this.audioCtx = new AudioCtx();
            if (this.audioCtx.state === "suspended") this.audioCtx.resume();

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(950, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(220, this.audioCtx.currentTime + 0.035);

            gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.035);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.038);
        } catch (e) {}
    }

    /**
     * Bật/tắt dải quét CRT Scanlines
     */
    toggleScanlines(enable) {
        let el = document.getElementById("crt-scanlines-layer");
        if (!el && enable) {
            el = document.createElement("div");
            el.id = "crt-scanlines-layer";
            el.className = "crt-scanlines";
            document.body.appendChild(el);
        }
        if (el) {
            el.style.display = enable ? "block" : "none";
        }
    }
}

if (typeof window !== "undefined") {
    window.EffectsEngine = EffectsEngine;
}
