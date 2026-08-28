/**
 * effects.js v3.0 — AnkLaBo Bio
 * Canvas effects: Starfield Warp, Aurora/Nebula, Matrix Rain, Snowfall, Cyber Embers
 * Also: CRT scanlines toggle, Web Audio mechanical click
 */

class EffectsEngine {
    constructor() {
        this._canvas    = document.getElementById("bg-canvas");
        this._ctx       = this._canvas ? this._canvas.getContext("2d") : null;
        this._raf       = null;
        this._mode      = null;
        this._particles = [];
        this._time      = 0;
        this._audioCtx  = null;
        this._muted     = false;

        if (this._canvas) {
            this._resize();
            window.addEventListener("resize", () => this._resize());
        }
    }

    get W() { return this._canvas ? this._canvas.width  : window.innerWidth; }
    get H() { return this._canvas ? this._canvas.height : window.innerHeight; }

    _resize() {
        if (!this._canvas) return;
        this._canvas.width  = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this._buildParticles(this._mode);
    }

    /* ---- Public API ---- */

    setEffect(mode) {
        this._mode = mode;
        cancelAnimationFrame(this._raf);
        if (!this._ctx || mode === "none") {
            if (this._ctx) this._ctx.clearRect(0, 0, this.W, this.H);
            return;
        }
        this._buildParticles(mode);
        this._loop(mode);
    }

    toggleScanlines(on) {
        const el = document.getElementById("crt-scanlines-layer");
        if (el) el.style.display = on ? "block" : "none";
    }

    playClick() {
        if (this._muted) return;
        if (!window.CONFIG || window.CONFIG.theme.clickSound === false) return;
        try {
            if (!this._audioCtx) {
                this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ac  = this._audioCtx;
            const buf = ac.createBuffer(1, ac.sampleRate * 0.03, ac.sampleRate);
            const ch  = buf.getChannelData(0);
            for (let i = 0; i < ch.length; i++) {
                ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.012));
            }
            const src  = ac.createBufferSource();
            const gain = ac.createGain();
            src.buffer = buf;
            gain.gain.setValueAtTime(0.18, ac.currentTime);
            src.connect(gain);
            gain.connect(ac.destination);
            src.start();
        } catch (e) { /* AudioContext not available */ }
    }

    /* ---- Particle builders ---- */

    _buildParticles(mode) {
        const W = this.W, H = this.H;
        this._particles = [];
        this._time = 0;

        switch (mode) {
            case "starfield":
                for (let i = 0; i < 220; i++) {
                    this._particles.push({
                        x:     Math.random() * W - W / 2,
                        y:     Math.random() * H - H / 2,
                        z:     Math.random() * W,
                        px: 0, py: 0
                    });
                }
                break;

            case "aurora":
                // Bands pre-computed on first render; no static particles needed
                break;

            case "matrix":
                const cols = Math.floor(W / 16);
                for (let i = 0; i < cols; i++) {
                    this._particles.push({
                        x:     i * 16,
                        y:     Math.random() * H,
                        speed: Math.random() * 1.2 + 0.6,
                        chars: "01ABCDEFウォカコクコランダ".split("")
                    });
                }
                break;

            case "snow":
                for (let i = 0; i < 160; i++) {
                    this._particles.push({
                        x:     Math.random() * W,
                        y:     Math.random() * H,
                        r:     Math.random() * 2.5 + 0.5,
                        vx:    (Math.random() - .5) * 0.5,
                        vy:    Math.random() * 0.8 + 0.3,
                        alpha: Math.random() * 0.5 + 0.2
                    });
                }
                break;

            case "embers":
                for (let i = 0; i < 120; i++) {
                    this._particles.push({
                        x:     Math.random() * W,
                        y:     H + Math.random() * 80,
                        vx:    (Math.random() - .5) * 1.2,
                        vy:    -(Math.random() * 1.5 + 0.5),
                        life:  Math.random(),
                        maxL:  Math.random() * 0.6 + 0.4,
                        r:     Math.random() * 2 + 1
                    });
                }
                break;
        }
    }

    /* ---- Main animation loop ---- */

    _loop(mode) {
        const ctx = this._ctx;
        const tick = () => {
            this._raf = requestAnimationFrame(tick);
            this._time += 0.008;
            switch (mode) {
                case "starfield": this._renderStarfield(ctx); break;
                case "aurora":    this._renderAurora(ctx);    break;
                case "matrix":    this._renderMatrix(ctx);    break;
                case "snow":      this._renderSnow(ctx);      break;
                case "embers":    this._renderEmbers(ctx);    break;
            }
        };
        tick();
    }

    /* ---- STARFIELD WARP 3D ---- */
    _renderStarfield(ctx) {
        const W = this.W, H = this.H;
        const speed = 12;
        ctx.fillStyle = "rgba(8,8,16,0.35)";
        ctx.fillRect(0, 0, W, H);
        const cx = W / 2, cy = H / 2;

        for (const s of this._particles) {
            s.px = cx + (s.x / s.z) * W;
            s.py = cy + (s.y / s.z) * H;
            s.z -= speed;
            if (s.z <= 0) { s.z = W; s.x = Math.random() * W - cx; s.y = Math.random() * H - cy; }

            const nx   = cx + (s.x / s.z) * W;
            const ny   = cy + (s.y / s.z) * H;
            const size = Math.max(0, (1 - s.z / W) * 2.2);
            const br   = 1 - s.z / W;

            ctx.beginPath();
            ctx.moveTo(s.px, s.py);
            ctx.lineTo(nx, ny);
            ctx.strokeStyle = `rgba(${Math.floor(180 + br * 75)},${Math.floor(160 + br * 60)},255,${br * 0.85})`;
            ctx.lineWidth   = size;
            ctx.stroke();
        }
    }

    /* ---- AURORA / NEBULA ---- */
    _renderAurora(ctx) {
        const W = this.W, H = this.H, t = this._time;
        ctx.clearRect(0, 0, W, H);

        const bands = [
            { r:139, g:92,  b:246, phase: 0     },   // purple
            { r:6,   g:182, b:212, phase: 2.1   },   // cyan
            { r:236, g:72,  b:153, phase: 4.2   },   // pink
            { r:16,  g:185, b:129, phase: 1.05  },   // emerald
            { r:245, g:158, b:11,  phase: 3.14  },   // amber (subtle)
        ];

        for (const band of bands) {
            const grad = ctx.createLinearGradient(0, H * 0.1, 0, H * 0.9);
            const [r,g,b] = [band.r, band.g, band.b];
            grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
            grad.addColorStop(0.45,`rgba(${r},${g},${b},0.12)`);
            grad.addColorStop(0.55,`rgba(${r},${g},${b},0.12)`);
            grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

            ctx.beginPath();
            ctx.moveTo(0, H / 2);

            for (let x = 0; x <= W; x += 5) {
                const y = H / 2
                    + Math.sin(x * 0.005 + t * 0.35 + band.phase) * (H * 0.22)
                    + Math.sin(x * 0.013 + t * 0.18 + band.phase * 1.4) * (H * 0.1);
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }

            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
        }

        // Slow-moving nebula glow points
        for (let i = 0; i < 3; i++) {
            const x = W * (0.2 + 0.6 * Math.abs(Math.sin(t * 0.08 + i * 2.1)));
            const y = H * (0.3 + 0.4 * Math.abs(Math.sin(t * 0.06 + i * 1.5)));
            const g = ctx.createRadialGradient(x, y, 0, x, y, W * 0.3);
            const colors = [[139,92,246],[6,182,212],[236,72,153]];
            const [cr,cg,cb] = colors[i % colors.length];
            g.addColorStop(0,   `rgba(${cr},${cg},${cb},0.12)`);
            g.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
        }
    }

    /* ---- MATRIX RAIN ---- */
    _renderMatrix(ctx) {
        const W = this.W, H = this.H;
        ctx.fillStyle = "rgba(8,8,16,0.1)";
        ctx.fillRect(0, 0, W, H);
        ctx.font      = "14px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#00ff41";

        for (const col of this._particles) {
            const ch = col.chars[Math.floor(Math.random() * col.chars.length)];
            ctx.fillStyle = col.y < 40
                ? "rgba(180,255,180,0.95)"
                : `rgba(0,${Math.floor(120 + col.y / H * 135)},65,0.85)`;
            ctx.fillText(ch, col.x, col.y);
            col.y += col.speed * 14;
            if (col.y > H + 20) col.y = -14;
        }
    }

    /* ---- SNOWFALL ---- */
    _renderSnow(ctx) {
        const W = this.W, H = this.H;
        ctx.clearRect(0, 0, W, H);

        for (const p of this._particles) {
            p.x  = (p.x + p.vx + W) % W;
            p.y += p.vy;
            p.vx += (Math.random() - .5) * 0.05;
            if (p.y > H + 5) { p.y = -5; p.x = Math.random() * W; }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220,230,255,${p.alpha})`;
            ctx.fill();
        }
    }

    /* ---- CYBER EMBERS ---- */
    _renderEmbers(ctx) {
        const W = this.W, H = this.H;
        ctx.clearRect(0, 0, W, H);

        for (const p of this._particles) {
            p.life -= 0.004;
            if (p.life <= 0) {
                Object.assign(p, {
                    x:    Math.random() * W,
                    y:    H + 10,
                    vx:   (Math.random() - .5) * 1.2,
                    vy:   -(Math.random() * 1.5 + 0.5),
                    life: Math.random() * 0.5 + 0.5,
                    maxL: 1
                });
            }

            p.x  += p.vx;
            p.y  += p.vy;
            p.vx *= 0.99;

            const al = p.life / p.maxL;
            const h  = 280 + (1 - al) * 60;  // purple → pink/red
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${h},100%,70%,${al * 0.75})`;
            ctx.fill();

            // Ember trail glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${h},100%,70%,${al * 0.12})`;
            ctx.fill();
        }
    }
}

if (typeof window !== "undefined") {
    window.EffectsEngine = EffectsEngine;
}
