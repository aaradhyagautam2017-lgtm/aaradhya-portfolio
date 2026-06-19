/* ──────────────────────────────────────────────────────────────────────────
   Site preloader controller.

   Visual design = the Antigravity "Project Orbit — System Initialization"
   screen (black-hole backdrop, HUD frame, drifting particles, telemetry log).
   Loading logic = real "gates" rather than a fixed timer, so the overlay only
   clears once the page is genuinely ready:
     dom       — DOM parsed and scripts running
     wormhole  — Three.js tunnel has painted its first frame
     sanity    — Sanity CMS fetch settled (success or failure)
     assets    — key images (orbit figures + project heroes) preloaded
   A minimum display time keeps it cinematic; a hard safety cap guarantees the
   page is always revealed even if a gate never reports.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  var GATES = ['dom', 'wormhole', 'sanity', 'assets'];

  // Telemetry copy keyed to progress thresholds (from the Antigravity design).
  var TELEMETRY = [
    { at: 0,   text: 'INITIALIZING EXPEDITION CONDUIT...' },
    { at: 15,  text: 'CALIBRATING ORBITAL TELEMETRY...' },
    { at: 35,  text: 'SYNCHRONIZING GRAVITATIONAL SENSORS...' },
    { at: 52,  text: 'SCANNING ACCRETION DISK SPECTRUM...' },
    { at: 70,  text: 'CALCULATING ASTEROID FIELD VECTORS...' },
    { at: 85,  text: 'STABILIZING EVENT HORIZON BRIDGE...' },
    { at: 95,  text: 'VERIFYING INTRUSION VECTORS...' },
    { at: 100, text: 'EXPEDITION READY // SYSTEM ONLINE' }
  ];

  var state = {};
  GATES.forEach(function (g) { state[g] = false; });

  var MIN_DISPLAY   = 2000;  // ms — never reveal faster than this
  var MAX_WAIT      = 9000;  // ms — always reveal by this, gates or not
  var startTime     = Date.now();
  var finished      = false;
  var revealed      = false;
  var assetFraction = 0;     // 0..1 progress within the assets gate
  var shown         = 0;     // eased progress actually displayed (0..1)

  function $(id) { return document.getElementById(id); }

  function target() {
    return 0.25 * (state.dom ? 1 : 0)
         + 0.25 * (state.wormhole ? 1 : 0)
         + 0.25 * (state.sanity ? 1 : 0)
         + 0.25 * assetFraction;
  }

  function telemetryFor(pct) {
    var t = TELEMETRY[0].text;
    for (var i = 0; i < TELEMETRY.length; i++) {
      if (pct >= TELEMETRY[i].at) t = TELEMETRY[i].text;
    }
    return t;
  }

  // ── Progress render loop ──────────────────────────────────────────────────
  var rafId = null;
  function tick() {
    var goal = finished ? 1 : target();
    shown += (goal - shown) * 0.10;
    if (goal - shown < 0.004) shown = goal;

    var pct  = Math.round(shown * 100);
    var pctEl = $('percentage-value');
    var fill  = $('progress-fill');
    var log   = $('telemetry-log');
    if (pctEl) pctEl.textContent = String(pct).padStart(3, '0') + '%';
    if (fill)  fill.style.width   = pct + '%';
    if (log && !finished) log.textContent = telemetryFor(pct);

    if (finished && shown >= 0.999) { exit(); return; }
    rafId = requestAnimationFrame(tick);
  }

  function allPassed() {
    for (var i = 0; i < GATES.length; i++) {
      if (!state[GATES[i]]) return false;
    }
    return true;
  }

  function markFinished() {
    if (finished) return;
    finished = true;
    // Guarantee the overlay clears even if requestAnimationFrame is throttled
    // (e.g. a backgrounded tab), where the eased progress loop can stall. The
    // smooth path in tick() still handles the common foreground case first;
    // exit() is idempotent, so this is just a safety net.
    setTimeout(exit, 800);
  }

  function maybeFinish() {
    if (finished) return;
    var elapsed = Date.now() - startTime;
    if (allPassed()) {
      if (elapsed >= MIN_DISPLAY) markFinished();
      else setTimeout(markFinished, MIN_DISPLAY - elapsed);
    }
  }

  // ── Layered exit (matches the Antigravity exit choreography) ──────────────
  function exit() {
    if (revealed) return;
    revealed = true;

    var pctEl = $('percentage-value');
    var fill  = $('progress-fill');
    var log   = $('telemetry-log');
    if (pctEl) pctEl.textContent = '100%';
    if (fill)  fill.style.width  = '100%';
    if (log)   { log.textContent = 'EXPEDITION READY // SYSTEM ONLINE'; log.style.color = 'rgba(255,255,255,0.9)'; }
    var brackets = document.querySelectorAll('#site-preloader .bracket-hud');
    for (var i = 0; i < brackets.length; i++) brackets[i].style.color = 'rgba(255,255,255,0.65)';

    var root    = $('site-preloader');
    var wrapper = $('preloader-wrapper');
    var bg      = $('cinematic-bg');
    var canvas  = $('particle-canvas');

    // Brief hold on 100%, then the staggered fade.
    setTimeout(function () {
      if (wrapper) wrapper.classList.add('exit-active');
      if (bg)      bg.classList.add('exit-active');
      if (canvas)  canvas.classList.add('exit-active');
      setTimeout(function () { if (root) root.classList.add('is-hidden'); }, 950);
      setTimeout(function () {
        if (root && root.parentNode) root.parentNode.removeChild(root);
        if (particleRaf) cancelAnimationFrame(particleRaf);
        if (rafId) cancelAnimationFrame(rafId);
      }, 1900);
    }, 600);

    document.body.classList.remove('preloading');
    window.dispatchEvent(new Event('preloader:done'));
  }

  // ── Public API (called by wormhole.js and portfolio.js) ───────────────────
  var Preloader = {
    pass: function (gate) {
      if (state.hasOwnProperty(gate) && !state[gate]) {
        state[gate] = true;
        if (gate === 'assets') assetFraction = 1;
        maybeFinish();
      }
    },
    setAssetProgress: function (frac) {
      if (state.assets) return;
      assetFraction = Math.max(assetFraction, Math.min(1, frac || 0));
    }
  };
  window.Preloader = Preloader;

  // ── Gate: dom (also reveals the loader wrapper) ───────────────────────────
  function onDomReady() {
    var wrapper = $('preloader-wrapper');
    if (wrapper) setTimeout(function () { wrapper.style.opacity = '1'; }, 200);
    Preloader.pass('dom');
  }
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    onDomReady();
  } else {
    document.addEventListener('DOMContentLoaded', onDomReady);
  }

  // ── Fallbacks so a silent failure can't strand the overlay ────────────────
  window.addEventListener('load', function () {
    setTimeout(function () { Preloader.pass('wormhole'); }, 3000);
  });
  setTimeout(function () {
    GATES.forEach(function (g) { state[g] = true; });
    assetFraction = 1;
    markFinished();
  }, MAX_WAIT);

  rafId = requestAnimationFrame(tick);

  /* ────────────────────────────────────────────────────────────────────────
     Cosmic particle drift (from the Antigravity design). Decorative only.
     ──────────────────────────────────────────────────────────────────────── */
  var particleRaf = null;
  (function initParticles() {
    var canvas = document.getElementById('particle-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var asteroids = [];

    function Star(w, h) { this.w = w; this.h = h; this.reset(); this.x = Math.random() * w; this.y = Math.random() * h; }
    Star.prototype.reset = function () {
      this.x = Math.random() * this.w;
      this.y = this.h + 10;
      this.size = Math.random() * 1.4 + 0.3;
      this.speedY = -(Math.random() * 0.12 + 0.04);
      this.speedX = (Math.random() - 0.5) * 0.03;
      this.baseAlpha = Math.random() * 0.35 + 0.1;
      this.alpha = this.baseAlpha;
      this.pulse = Math.random() * 100;
    };
    Star.prototype.update = function () {
      this.x += this.speedX; this.y += this.speedY;
      this.pulse += 0.015;
      this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.08;
      if (this.y < -10 || this.x < -10 || this.x > this.w + 10) { this.reset(); this.y = this.h + Math.random() * 10; }
    };
    Star.prototype.draw = function (c) {
      c.beginPath(); c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      c.fillStyle = 'rgba(255,255,255,' + Math.max(0.05, Math.min(1, this.alpha)) + ')'; c.fill();
    };

    function Asteroid(w, h) { this.w = w; this.h = h; this.reset(); this.x = Math.random() * w; this.y = Math.random() * h; }
    Asteroid.prototype.reset = function () {
      this.x = Math.random() * this.w;
      this.y = this.h + 40;
      this.size = Math.random() * 6 + 2;
      this.speedY = -(Math.random() * 0.06 + 0.02);
      this.speedX = -(Math.random() * 0.02 + 0.01);
      this.alpha = Math.random() * 0.06 + 0.02;
    };
    Asteroid.prototype.update = function () {
      this.x += this.speedX; this.y += this.speedY;
      if (this.y < -40 || this.x < -40 || this.x > this.w + 40) { this.reset(); this.y = this.h + Math.random() * 30; }
    };
    Asteroid.prototype.draw = function (c) {
      c.beginPath(); c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      c.fillStyle = 'rgba(255,255,255,' + this.alpha + ')'; c.fill();
    };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = []; asteroids = [];
      var pc = Math.min(50, Math.floor(window.innerWidth / 30));
      var ac = Math.min(6, Math.floor(window.innerWidth / 200));
      for (var i = 0; i < pc; i++) particles.push(new Star(canvas.width, canvas.height));
      for (var j = 0; j < ac; j++) asteroids.push(new Asteroid(canvas.width, canvas.height));
    }
    window.addEventListener('resize', resize);
    resize();

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(ctx); }
      for (var j = 0; j < asteroids.length; j++) { asteroids[j].update(); asteroids[j].draw(ctx); }
      particleRaf = requestAnimationFrame(loop);
    }
    loop();
  }());
}());
