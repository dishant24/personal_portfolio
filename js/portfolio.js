/* dishant.ai — portfolio.js */
'use strict';

/* ============================================================
   PARTICLE FIELD
   ============================================================ */
class ParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.resize();
    this.spawn();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
    this.loop();
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn() {
    const n = Math.min(55, Math.floor(window.innerWidth / 22));
    this.particles = Array.from({ length: n }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .5,
    }));
  }

  loop() {
    const { ctx, canvas, particles, mouse } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      // mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        const force = (90 - dist) / 90 * .8;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // damping
      p.vx *= .97;
      p.vy *= .97;

      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,.55)';
      ctx.fill();
    }

    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 130) * .18})`;
          ctx.lineWidth   = .8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function initCursorGlow() {
  const el = document.getElementById('cursor-glow');
  if (!el) return;
  // hide on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) { el.style.display = 'none'; return; }
  document.addEventListener('mousemove', e => {
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
  });
}

/* ============================================================
   SCROLL PROGRESS + TOKEN COUNTER
   ============================================================ */
function initScrollProgress() {
  const bar   = document.getElementById('scroll-progress');
  const token = document.getElementById('token-counter');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (bar) bar.style.width = (pct * 100) + '%';
    if (token) token.textContent = 'tokens: ' + (Math.floor(pct * 42) + 1280);
  }, { passive: true });
}

/* ============================================================
   NAVBAR — active link + hamburger
   ============================================================ */
function initNavbar() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: .4 });

  sections.forEach(s => io.observe(s));

  // hamburger
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('nav-drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      drawer.classList.toggle('open');
    });
  }
}

window.closeDrawer = function () {
  document.getElementById('nav-burger')?.classList.remove('open');
  document.getElementById('nav-drawer')?.classList.remove('open');
};

/* ============================================================
   TERMINAL BOOT SEQUENCE
   ============================================================ */
function initTerminal() {
  const body = document.getElementById('term-body');
  if (!body) return;

  const lines = [
    { type: 'cmd',  text: '$ ssh dishant@ai.agent --init' },
    { type: 'info', text: 'Establishing secure tunnel...' },
    { type: 'ok',   text: '✓ Connection established' },
    { type: 'cmd',  text: '$ load --profile dishant.sutariya' },
    { type: 'ok',   text: '✓ Profile loaded — ML Engineer · AI Researcher' },
    { type: 'cmd',  text: '$ query --papers --count' },
    { type: 'ok',   text: '✓ 2 publications indexed (MICCAI 2025 · BVM 2026)' },
    { type: 'cmd',  text: '$ check --awards' },
    { type: 'ok',   text: '✓ Best Poster Award — MICCAI 2025 FAIMI Workshop' },
  ];

  lines.forEach((line, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'term-line ' + line.type;
      el.innerHTML = `<span class="tl-prompt">&gt;</span><span class="tl-txt">${line.text}</span>`;
      body.appendChild(el);
    }, i * 280);
  });

  // blinking cursor after lines
  setTimeout(() => {
    const cur = document.createElement('div');
    cur.className = 'term-line cmd';
    cur.innerHTML = '<span class="tl-prompt">&gt;</span><span class="tl-txt role-cursor"></span>';
    body.appendChild(cur);
  }, lines.length * 280 + 200);
}

/* ============================================================
   ROLE TYPEWRITER
   ============================================================ */
function initRoles() {
  const el = document.getElementById('role-text');
  if (!el) return;

  const roles = [
    'Machine Learning Engineer',
    'AI Researcher',
    'Data Scientist',
    'Deep Learning Engineer',
    'Generative AI Developer',
    'MLOps Engineer',
    'Applied AI Researcher',
    'Computer Vision Engineer',
  ];

  let idx = 0, charIdx = 0, deleting = false;

  function tick() {
    const role = roles[idx];
    const cur  = '<span class="role-cursor"></span>';

    if (!deleting) {
      charIdx++;
      el.innerHTML = role.slice(0, charIdx) + cur;
      if (charIdx === role.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 55);
    } else {
      charIdx--;
      el.innerHTML = role.slice(0, charIdx) + cur;
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 30);
    }
  }

  setTimeout(tick, 1200);
}

/* ============================================================
   INTERSECTION OBSERVER — fade-up + exec-summary reveals
   ============================================================ */
function initObservers() {
  // fade-up for agent-bubbles and exec-summaries
  const fadeIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); fadeIO.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.fade-up').forEach(el => fadeIO.observe(el));

  // exec-summary pill reveal with stagger
  const execIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pills = e.target.querySelectorAll('.epill');
        pills.forEach((pill, i) => {
          pill.style.opacity = '0';
          pill.style.transform = 'translateY(8px)';
          setTimeout(() => {
            pill.style.transition = 'opacity .4s ease, transform .4s ease';
            pill.style.opacity = '1';
            pill.style.transform = 'none';
          }, 100 + i * 80);
        });
        execIO.unobserve(e.target);
      }
    });
  }, { threshold: .4 });
  document.querySelectorAll('.exec-summary').forEach(el => execIO.observe(el));
}

/* ============================================================
   SKILL BARS
   ============================================================ */
function initSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: .35 });
  document.querySelectorAll('.skill-cat').forEach(el => io.observe(el));
}

/* ============================================================
   COUNTERS
   ============================================================ */
function initCounters() {
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-count]').forEach(el => {
        const target = +el.dataset.count;
        const dur    = 1500;
        const start  = performance.now();
        function frame(now) {
          const t = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(easeOut(t) * target);
          if (t < 1) requestAnimationFrame(frame);
          else el.textContent = target;
        }
        requestAnimationFrame(frame);
      });
      io.unobserve(e.target);
    });
  }, { threshold: .3 });

  document.querySelectorAll('#hero, #about').forEach(el => io.observe(el));
}

/* ============================================================
   CARD TILT (3D hover)
   ============================================================ */
function initCardTilt() {
  const cards = document.querySelectorAll('.tl-card, .pub-card, .proj-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - .5;
      const y  = (e.clientY - r.top)  / r.height - .5;
      card.style.setProperty('--rx', (-y * 8) + 'deg');
      card.style.setProperty('--ry', ( x * 8) + 'deg');
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ============================================================
   CHIP SCROLL HELPER
   ============================================================ */
window.navScrollTo = function (selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // canvas particle field — skip on small mobile for perf
  if (window.innerWidth > 480) {
    const canvas = document.getElementById('canvas-bg');
    if (canvas) new ParticleField(canvas);
  }

  initCursorGlow();
  initScrollProgress();
  initNavbar();
  initTerminal();
  initRoles();
  initObservers();
  initSkillBars();
  initCounters();
  initCardTilt();
});
