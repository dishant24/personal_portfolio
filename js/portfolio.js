/* =====================================================
   dishant.ai — Futuristic ML/AI Portfolio
   portfolio.js — Vanilla JS interactions
   ===================================================== */

'use strict';

/* ============================================================
   ParticleField
   ============================================================ */
class ParticleField {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mouse = { x: -9999, y: -9999 };
    this.particles = [];
    this.running = true;

    this._resize();
    this._spawnParticles();
    this._bindEvents();
    this._tick();
  }

  _resize() {
    this.W = this.canvas.width  = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
  }

  _count() {
    return window.innerWidth < 768 ? 30 : 60;
  }

  _spawnParticles() {
    const n = this._count();
    this.particles = [];
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  Math.random() * 1.5 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  _bindEvents() {
    window.addEventListener('resize', () => {
      this._resize();
      this._spawnParticles();
    });
    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  _tick() {
    if (!this.running) return;
    const { ctx, W, H, particles, mouse } = this;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80 && dist > 0) {
        const force = (80 - dist) / 80;
        p.vx += (dx / dist) * force * 0.4;
        p.vy += (dy / dist) * force * 0.4;
      }

      // Clamp velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) {
        p.vx = (p.vx / speed) * 1.5;
        p.vy = (p.vy / speed) * 1.5;
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
      ctx.fill();

      // Connect to neighbors
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x;
        const ey = p.y - q.y;
        const d  = Math.sqrt(ex * ex + ey * ey);
        if (d < 130) {
          const alpha = (1 - d / 130) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this._tick());
  }
}

/* ============================================================
   CursorGlow
   ============================================================ */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let ax = window.innerWidth / 2;
  let ay = window.innerHeight / 2;
  let tx = ax;
  let ty = ay;

  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function update() {
    ax = lerp(ax, tx, 0.12);
    ay = lerp(ay, ty, 0.12);
    glow.style.left = ax + 'px';
    glow.style.top  = ay + 'px';
    requestAnimationFrame(update);
  }

  update();
}

/* ============================================================
   CardTilt
   ============================================================ */
function initCardTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx =  (dy / (rect.height / 2)) * 8;
      const ry = -(dx / (rect.width  / 2)) * 8;
      const mx = ((e.clientX - rect.left) / rect.width)  * 100;
      const my = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--rx', rx + 'deg');
      card.style.setProperty('--ry', ry + 'deg');
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ============================================================
   Terminal Boot
   ============================================================ */
function initTerminal() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const lines = [
    { cls: 't-cmd',  txt: '$ init portfolio_agent --profile dishant --version 2.0', ms: 0   },
    { cls: 't-info', txt: '  [sys] loading environment...', ms: 300  },
    { cls: 't-ok',   txt: '  ✓ env ready  [python 3.11 · pytorch 2.3 · cuda 12.1]', ms: 500  },
    { cls: 't-info', txt: '  [sys] indexing knowledge base...', ms: 350  },
    { cls: 't-ok',   txt: '  ✓ profile loaded  [2 publications · 3 roles · 18 skills]', ms: 600  },
    { cls: 't-info', txt: '  [sys] connecting to github.com/dishant24...', ms: 280  },
    { cls: 't-ok',   txt: '  ✓ repos indexed  [4 projects found]', ms: 700  },
    { cls: 't-info', txt: '  [sys] calibrating fairness engine...', ms: 320  },
    { cls: 't-ok',   txt: '  ✓ agent online  [model: dishant-researcher-v2]', ms: 600  },
  ];

  let delay = 0;
  lines.forEach(line => {
    delay += line.ms || 200;
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = line.cls;
      el.textContent = line.txt;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }, delay);
  });

  // Add blinking cursor after all lines
  const totalDelay = delay + 400;
  setTimeout(() => {
    const cur = document.createElement('span');
    cur.className = 't-cursor blink';
    body.appendChild(cur);
  }, totalDelay);
}

/* ============================================================
   Role Typewriter
   ============================================================ */
function initRoles() {
  const el = document.getElementById('role-display');
  if (!el) return;

  const roles = [
    'Machine Learning Engineer',
    'AI Researcher',
    'Data Scientist',
    'Medical Imaging Specialist',
    'Deep Learning Engineer',
    'Generative AI Developer',
    'MLOps Engineer',
    'Applied AI Researcher',
  ];

  let ri = 0;
  let ci = 0;
  let erasing = false;

  function tick() {
    const target = roles[ri];

    if (!erasing) {
      // Type
      el.textContent = target.slice(0, ci + 1);
      ci++;
      if (ci === target.length) {
        erasing = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 55);
    } else {
      // Erase
      el.textContent = target.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        erasing = false;
        ri = (ri + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 30);
    }
  }

  setTimeout(tick, 1200);
}

/* ============================================================
   Tool Call Reveals
   ============================================================ */
function initToolCalls() {
  const blocks = document.querySelectorAll('.tool-block');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const block = entry.target;
      if (block.dataset.revealed) return;
      block.dataset.revealed = '1';

      setTimeout(() => {
        const badge  = block.querySelector('.tc-badge');
        const result = block.querySelector('.tool-result');
        if (badge) {
          badge.textContent = '✓ done';
          badge.classList.add('done');
        }
        if (result) {
          result.classList.add('show');
        }
      }, 800);

      observer.unobserve(block);
    });
  }, { threshold: 0.3 });

  blocks.forEach(b => observer.observe(b));
}

/* ============================================================
   Skill Bars
   ============================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.sb-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      if (fill.dataset.animated) return;
      fill.dataset.animated = '1';

      const w = fill.dataset.w || '0';
      setTimeout(() => {
        fill.style.width = w + '%';
      }, 100);

      observer.unobserve(fill);
    });
  }, { threshold: 0.4 });

  fills.forEach((f, i) => {
    f.style.transitionDelay = (i * 0.08) + 's';
    observer.observe(f);
  });
}

/* ============================================================
   Counter Animation
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  function easeOutQuad(t) { return t * (2 - t); }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.done) return;
      el.dataset.done = '1';

      const target   = parseInt(el.dataset.target, 10) || 0;
      const duration = 1500;
      const start    = performance.now();

      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(easeOutQuad(t) * target);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   Scroll Progress + Token Counter
   ============================================================ */
function initScrollProgress() {
  const bar  = document.getElementById('scroll-progress');
  const tcEl = document.getElementById('tc-val');

  if (!bar) return;

  function onScroll() {
    const scrollY   = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    bar.style.width = pct + '%';

    if (tcEl) {
      const tokens = Math.floor(pct * 42) + 1280;
      tcEl.textContent = tokens.toLocaleString();
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   Fade-Up + Timeline Fades (IntersectionObserver)
   ============================================================ */
function initFades() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up, .tl-fade').forEach(el => observer.observe(el));
}

/* ============================================================
   Active Nav
   ============================================================ */
function initNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   Mobile Hamburger
   ============================================================ */
function initMobileNav() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   Smooth scroll for chip/anchor links (offset for navbar)
   ============================================================ */
function initSmoothScroll() {
  const NAV_H = 64;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   Boot
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  new ParticleField();
  initCursorGlow();
  initCardTilt();
  initTerminal();
  initRoles();
  initToolCalls();
  initSkillBars();
  initCounters();
  initScrollProgress();
  initFades();
  initNav();
  initMobileNav();
  initSmoothScroll();
});
