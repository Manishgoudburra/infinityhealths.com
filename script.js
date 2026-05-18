/* ===================================================
   INFINITY GREENS — GREMIN
   script.js — Complete JavaScript
   =================================================== */

'use strict';

/* ====== PARTICLE SYSTEM ====== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  const particles = [];
  const COUNT = Math.min(80, Math.floor(W * H / 14000));

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.alpha = Math.random() * 0.4 + 0.05;
      this.life = 1;
      this.decay = Math.random() * 0.002 + 0.0005;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * this.alpha;
      ctx.fillStyle = '#39ff78';
      ctx.shadowColor = '#39ff78';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  }, { passive: true });
})();

/* ====== NAVBAR ====== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) cur = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${cur}`);
  });
}, { passive: true });

/* ====== SCROLL REVEAL ====== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger reveal for siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach(sib => {
        if (!sib.classList.contains('visible')) {
          sib.style.transitionDelay = delay + 'ms';
          delay += 80;
        }
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ====== CART TOAST ====== */
const cartToast = document.getElementById('cartToast');
const cartToastMsg = document.getElementById('cartToastMsg');
let toastTimer = null;

function addToCart(name, price) {
  cartToastMsg.textContent = `${name} (${price}) added!`;
  cartToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => cartToast.classList.remove('show'), 2800);
}
window.addToCart = addToCart;

/* ====== PRODUCT QUICK VIEW MODAL ====== */
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

const productData = {
  1: {
    name: 'GREMIN Sachet Pack',
    sub: 'Single-serve precision recovery formula — 10 individual sachets, each packed with a full 30g serving.',
    price: '₹799',
    features: [
      '10 sachets × 30g each (10 servings)',
      'Complete EAA matrix — all 9 essential amino acids',
      'Electrolyte blend: Mg, K, Na, Cl',
      'DigeZyme® enzyme complex for easy digestion',
      'Zero artificial colors or fillers',
      'Free nutrition & timing guide included',
    ]
  },
  2: {
    name: 'GREMIN Protein Tub — 1kg',
    sub: '25 premium servings of the most advanced recovery formula ever engineered. The athlete standard.',
    price: '₹2,999',
    features: [
      '1kg tub — 25 full servings',
      '40g protein per serving with complete EAA profile',
      'Precision electrolyte matrix for cramp elimination',
      'Advanced hydration absorption matrix',
      'Anti-inflammatory herbal recovery blend',
      'Premium shaker bottle included',
    ]
  },
  3: {
    name: 'Recovery Pro Pack',
    sub: 'The complete elite recovery system. 2kg tub, premium shaker, and the full athlete nutrition guide.',
    price: '₹5,499',
    features: [
      '2kg tub — 50 servings (2-month supply)',
      'All GREMIN 1kg features included',
      'Premium stainless steel shaker bottle',
      'Full athlete nutrition & periodization guide',
      'Priority access to new formula drops',
      'Dedicated athlete support line access',
    ]
  }
};

function openModal(id) {
  const data = productData[id];
  if (!data) return;
  modalContent.innerHTML = `
    <div class="modal-tier">GREMIN FORMULA</div>
    <h3>${data.name}</h3>
    <p class="modal-sub">${data.sub}</p>
    <div class="modal-price">${data.price}</div>
    <ul class="modal-features">
      ${data.features.map(f => `<li>${f}</li>`).join('')}
    </ul>
    <button class="btn-primary" style="width:100%;justify-content:center;" onclick="addToCart('${data.name}', '${data.price}'); closeModal();">
      <span>Add to Cart</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  `;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
window.closeModal = closeModal;

document.querySelectorAll('.quickview-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    openModal(parseInt(btn.dataset.id));
  });
});
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

// Modal tier label styling
const style = document.createElement('style');
style.textContent = `.modal-tier{font-size:10px;font-weight:700;letter-spacing:3px;color:var(--green);margin-bottom:10px;}`;
document.head.appendChild(style);

/* ====== FAQ ACCORDION ====== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = '0';
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    // Open clicked
    if (!isOpen) {
      item.classList.add('open');
      const answer = item.querySelector('.faq-a');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ====== TESTIMONIAL CAROUSEL ====== */
(function initCarousel() {
  const carousel = document.getElementById('carousel');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoTimer;
  let visibleCount = getVisibleCount();

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, total - visibleCount);
  }

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    const dotCount = getMaxIndex() + 1;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, getMaxIndex()));
    const cardW = cards[0].offsetWidth + 28; // gap
    carousel.style.transform = `translateX(-${current * cardW}px)`;
    carousel.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
    updateDots();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      current = current >= getMaxIndex() ? 0 : current + 1;
      goTo(current);
    }, 4000);
  }

  // Touch support
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    resetAuto();
  }, { passive: true });

  window.addEventListener('resize', () => {
    visibleCount = getVisibleCount();
    current = Math.min(current, getMaxIndex());
    createDots();
    goTo(current);
  }, { passive: true });

  createDots();
  resetAuto();
})();

/* ====== SMOOTH SCROLL for anchor links ====== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ====== FORM HANDLERS ====== */
function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn = e.target.querySelector('button');
  const orig = btn.textContent;
  btn.textContent = '✓ Subscribed!';
  btn.style.background = '#fff';
  input.value = '';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
}
window.handleNewsletter = handleNewsletter;

function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const origText = btn.querySelector('span') ? btn.querySelector('span').textContent : btn.textContent;
  btn.innerHTML = `<span>Message Sent ✓</span>`;
  btn.style.background = '#1a9940';
  btn.style.borderColor = '#1a9940';
  btn.style.color = '#fff';
  e.target.reset();
  setTimeout(() => {
    btn.innerHTML = `<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.style.color = '';
  }, 3500);
}
window.handleContact = handleContact;

/* ====== TILT EFFECT on product cards (desktop only) ====== */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.product-card, .benefit-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width / 2, cy = r.height / 2;
      const rx = ((y - cy) / cy) * 4;
      const ry = ((x - cx) / cx) * -4;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s, border-color 0.35s';
    });
  });
}

/* ====== TYPING EFFECT on hero (optional polish) ====== */
(function heroEntrance() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;
  // Simply trigger visibility with a delay
  setTimeout(() => {
    document.querySelectorAll('#hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 300);
})();

/* ====== NUMBER COUNTER ANIMATION ====== */
function animateCounter(el, target, suffix = '') {
  const num = parseFloat(target);
  const duration = 1500;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = num % 1 === 0 ? Math.floor(eased * num) : (eased * num).toFixed(1);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(n => {
        const text = n.textContent;
        const num = parseFloat(text);
        if (!isNaN(num)) animateCounter(n, num, text.replace(String(num), ''));
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ====== GLOWING CURSOR TRAIL (desktop) ====== */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position:fixed;pointer-events:none;z-index:9999;
    width:8px;height:8px;border-radius:50%;
    background:rgba(57,255,120,0.6);
    box-shadow:0 0 12px rgba(57,255,120,0.8);
    transform:translate(-50%,-50%);
    transition:transform 0.1s,opacity 0.3s;
    opacity:0;
  `;
  document.body.appendChild(trail);
  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    trail.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { trail.style.opacity = '0'; });
  function updateTrail() {
    tx += (mx - tx) * 0.2;
    ty += (my - ty) * 0.2;
    trail.style.left = tx + 'px';
    trail.style.top = ty + 'px';
    requestAnimationFrame(updateTrail);
  }
  updateTrail();
}

console.log('%c∞ INFINITY GREENS', 'color:#39ff78;font-size:24px;font-weight:bold;text-shadow:0 0 20px #39ff78;');
console.log('%cGREMIN — More Than Protein. Complete Recovery.', 'color:#aaa;font-size:12px;');
