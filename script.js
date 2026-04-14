/* ============================================================
   FOVIZ — Premium Agency JS
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─── NAV ─────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links') && (() => {
    const links = document.querySelector('.nav-links');
    const isOpen = links.style.display === 'flex';
    links.style.display = isOpen ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'fixed';
    links.style.top = '72px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'rgba(5,5,8,0.97)';
    links.style.padding = '24px';
    links.style.gap = '20px';
    links.style.zIndex = '999';
    links.style.backdropFilter = 'blur(20px)';
  })();
});

/* ─── SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 72 },
      duration: 1.2,
      ease: 'power3.inOut'
    });
  });
});

/* ─── HERO ENTRANCE ───────────────────────────────────────── */
const heroTl = gsap.timeline({ delay: 0.3 });
heroTl
  .from('.hero-badge', {
    opacity: 0, y: 24, duration: 0.8, ease: 'power3.out'
  })
  .from('.hero-headline', {
    opacity: 0, y: 40, duration: 1, ease: 'power4.out'
  }, '-=0.4')
  .from('.hero-sub', {
    opacity: 0, y: 24, duration: 0.8, ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-actions', {
    opacity: 0, y: 20, duration: 0.7, ease: 'power3.out'
  }, '-=0.5')
  .from('.hero-stats', {
    opacity: 0, y: 20, duration: 0.7, ease: 'power3.out'
  }, '-=0.4')
  .from('.hero-scroll-hint', {
    opacity: 0, duration: 0.6
  }, '-=0.2');

/* ─── HERO PARALLAX ───────────────────────────────────────── */
gsap.to('.hero-video', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

gsap.to('.hero-content', {
  yPercent: 12,
  opacity: 0.3,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'center top',
    end: 'bottom top',
    scrub: true
  }
});

/* ─── REVEAL ANIMATIONS ───────────────────────────────────── */
document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      delay: (i % 4) * 0.08
    }
  );
});

/* ─── COUNTER ANIMATION ───────────────────────────────────── */
function animateCounters(container) {
  container.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(this.targets()[0].val);
          }
        });
      },
      once: true
    });
  });
}
animateCounters(document);

/* ─── STAT BARS ───────────────────────────────────────────── */
document.querySelectorAll('.stat-bar').forEach(bar => {
  const targetWidth = bar.dataset.width + '%';
  ScrollTrigger.create({
    trigger: bar,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(bar, { width: targetWidth, duration: 1.5, ease: 'power3.out' });
    },
    once: true
  });
});

/* ─── CANVAS CHART ────────────────────────────────────────── */
function drawChart() {
  const canvas = document.getElementById('growthChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const points = [
    { x: 0.0, y: 0.85 },
    { x: 0.1, y: 0.80 },
    { x: 0.18, y: 0.75 },
    { x: 0.25, y: 0.70 },
    { x: 0.35, y: 0.60 },
    { x: 0.45, y: 0.50 },
    { x: 0.55, y: 0.38 },
    { x: 0.65, y: 0.28 },
    { x: 0.75, y: 0.18 },
    { x: 0.85, y: 0.10 },
    { x: 0.95, y: 0.04 },
    { x: 1.00, y: 0.02 }
  ];

  let progress = 0;
  const speed = 0.012;

  function draw(p) {
    ctx.clearRect(0, 0, W, H);
    const pad = { l: 20, r: 20, t: 16, b: 24 };
    const cw = W - pad.l - pad.r;
    const ch = H - pad.t - pad.b;

    const visiblePoints = points.filter(pt => pt.x <= p);
    if (visiblePoints.length < 2) return;

    const grad = ctx.createLinearGradient(pad.l, 0, pad.l + cw, 0);
    grad.addColorStop(0, '#00d4ff');
    grad.addColorStop(1, '#4d9dff');

    const areaGrad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    areaGrad.addColorStop(0, 'rgba(0,212,255,0.2)');
    areaGrad.addColorStop(1, 'rgba(0,212,255,0)');

    const toScreen = pt => ({
      x: pad.l + pt.x * cw,
      y: pad.t + pt.y * ch
    });

    ctx.beginPath();
    const first = toScreen(visiblePoints[0]);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < visiblePoints.length; i++) {
      const prev = toScreen(visiblePoints[i - 1]);
      const curr = toScreen(visiblePoints[i]);
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const last = toScreen(visiblePoints[visiblePoints.length - 1]);
    ctx.lineTo(last.x, pad.t + ch);
    ctx.lineTo(first.x, pad.t + ch);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(last.x, last.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00d4ff';
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;

    const labelY = [0.25, 0.5, 0.75, 1.0];
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.textAlign = 'left';
    labelY.forEach(ly => {
      const sy = pad.t + ly * ch;
      ctx.beginPath();
      ctx.moveTo(pad.l, sy);
      ctx.lineTo(pad.l + cw, sy);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  ScrollTrigger.create({
    trigger: '#growthChart',
    start: 'top 85%',
    onEnter: () => {
      const animate = () => {
        progress = Math.min(progress + speed, 1);
        draw(progress);
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    },
    once: true
  });
}
drawChart();

/* ─── SERVICE CARD TILT ───────────────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;

    card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--my', `${(y / rect.height) * 100}%`);

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
  });
});

/* ─── SERVICES STAGGER ────────────────────────────────────── */
gsap.from('.service-card', {
  opacity: 0,
  y: 50,
  stagger: 0.12,
  duration: 0.9,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.services-grid',
    start: 'top 80%'
  }
});

/* ─── PORTFOLIO CARDS ─────────────────────────────────────── */
gsap.from('.portfolio-card', {
  opacity: 0,
  scale: 0.96,
  stagger: 0.1,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.portfolio-grid',
    start: 'top 82%'
  }
});

/* ─── CASE STUDY STAGGER ──────────────────────────────────── */
gsap.from('.case-card', {
  opacity: 0,
  y: 40,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.cases-grid',
    start: 'top 82%'
  }
});

/* ─── TEAM GRID ───────────────────────────────────────────── */
gsap.from('.team-card', {
  opacity: 0,
  y: 30,
  stagger: 0.08,
  duration: 0.7,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.team-grid',
    start: 'top 82%'
  }
});

/* ─── MARQUEE PAUSE ON HOVER ──────────────────────────────── */
const track = document.querySelector('.marquee-track');
if (track) {
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

/* ─── FORM SUBMIT ─────────────────────────────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = 'Sending...';
    btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.textContent = 'Request Received!';
      btn.style.background = 'linear-gradient(135deg, #00d4ff, #4d9dff)';
      setTimeout(() => {
        btn.textContent = 'Start My Project';
        btn.style.pointerEvents = 'auto';
        form.reset();
      }, 3000);
    }, 1200);
  });
}

/* ─── SECTION PARALLAX ────────────────────────────────────── */
['.trust-strip', '.analytics', '.case-studies', '.team'].forEach(sel => {
  const el = document.querySelector(sel);
  if (!el) return;
  gsap.fromTo(el,
    { backgroundPositionY: '-10%' },
    {
      backgroundPositionY: '10%',
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );
});

/* ─── AMBIENT GLOW FOLLOW ─────────────────────────────────── */
let glowEl = null;
function createGlow() {
  glowEl = document.createElement('div');
  glowEl.style.cssText = `
    position:fixed;pointer-events:none;z-index:0;
    width:400px;height:400px;border-radius:50%;
    background:radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:opacity 0.3s;
    opacity:0;
  `;
  document.body.appendChild(glowEl);
}
createGlow();
let gx = 0, gy = 0;
let cx = 0, cy = 0;
document.addEventListener('mousemove', e => {
  gx = e.clientX;
  gy = e.clientY;
  glowEl.style.opacity = '1';
});
function tickGlow() {
  cx += (gx - cx) * 0.07;
  cy += (gy - cy) * 0.07;
  if (glowEl) {
    glowEl.style.left = cx + 'px';
    glowEl.style.top = cy + 'px';
  }
  requestAnimationFrame(tickGlow);
}
tickGlow();

/* ─── PORTFOLIO HOVER PLAY EFFECT ─────────────────────────── */
document.querySelectorAll('.portfolio-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card.querySelector('.play-btn'), {
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.4)'
    });
  });
});

/* ─── NUMBER TICKER IN HERO ───────────────────────────────── */
document.querySelectorAll('.hero-stat .stat-num').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  setTimeout(() => {
    gsap.to({ val: 0 }, {
      val: target,
      duration: 2.4,
      delay: 1,
      ease: 'power2.out',
      onUpdate() {
        el.textContent = Math.round(this.targets()[0].val);
      }
    });
  }, 100);
});

/* ─── SCROLL PROGRESS BAR ─────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position:fixed;top:0;left:0;height:2px;
  background:linear-gradient(90deg,#00d4ff,#4d9dff);
  z-index:9999;width:0%;
  transition:width 0.1s linear;
  box-shadow:0 0 8px rgba(0,212,255,0.6);
`;
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

/* ─── FINAL CTA ENTRANCE ──────────────────────────────────── */
gsap.from('.cta-headline', {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.cta-final',
    start: 'top 75%'
  }
});
gsap.from('.cta-sub', {
  opacity: 0,
  y: 30,
  duration: 0.9,
  ease: 'power3.out',
  delay: 0.15,
  scrollTrigger: {
    trigger: '.cta-final',
    start: 'top 75%'
  }
});
gsap.from('.cta-form-wrap', {
  opacity: 0,
  y: 30,
  duration: 0.9,
  ease: 'power3.out',
  delay: 0.3,
  scrollTrigger: {
    trigger: '.cta-final',
    start: 'top 75%'
  }
});
