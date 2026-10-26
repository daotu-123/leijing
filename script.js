/* 瑞士风版 script.js —— 移动导航 / 灯箱 / 触发式动效 / count-up */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 移动导航 ---------- */
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  nav?.classList.toggle('is-open', open);
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', '打开导航');
  nav.classList.remove('is-open');
}));

/* ---------- 灯箱 ---------- */
const dialog = document.querySelector('.lightbox');
const lightboxImage = dialog?.querySelector('img');
const counter = dialog?.querySelector('.lb-counter');
const gallery = ['assets/prototype01.jpg', 'assets/prototype02.jpg', 'assets/prototype03.jpg'];
let currentPhoto = 0;

function showPhoto(index) {
  currentPhoto = (index + gallery.length) % gallery.length;
  if (lightboxImage) lightboxImage.src = gallery[currentPhoto];
  if (counter) counter.textContent = `${currentPhoto + 1} / ${gallery.length}`;
}

document.querySelector('[data-gallery-open]')?.addEventListener('click', () => {
  showPhoto(0);
  dialog?.showModal();
});
dialog?.querySelector('.lb-close')?.addEventListener('click', () => dialog.close());
dialog?.querySelector('.lb-prev')?.addEventListener('click', () => showPhoto(currentPhoto - 1));
dialog?.querySelector('.lb-next')?.addEventListener('click', () => showPhoto(currentPhoto + 1));
dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.addEventListener('keydown', event => {
  if (!dialog?.open) return;
  if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
});

/* ---------- 触发式动效:进入视口加 .in ---------- */
const animated = document.querySelectorAll('[data-anim]');
if ('IntersectionObserver' in window && !reduced) {
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  }), { threshold: 0.15 });
  animated.forEach(el => io.observe(el));
} else {
  animated.forEach(el => el.classList.add('in'));
}

/* ---------- count-up:账单巨数 0→目标 ---------- */
function countUp(el) {
  const target = Number(el.dataset.count || '0');
  if (reduced || target === 2027) { el.textContent = String(target); return; }
  const dur = 900;
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
document.querySelectorAll('[data-count]').forEach(el => {
  if ('IntersectionObserver' in window && !reduced) {
    const co = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { countUp(el); co.disconnect(); }
    }), { threshold: 0.4 });
    co.observe(el);
  } else {
    el.textContent = el.dataset.count;
  }
});
