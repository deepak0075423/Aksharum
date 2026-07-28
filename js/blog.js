/* ── GSAP CDN fallback ──
   If the GSAP CDN fails to load, stub the animation API so nav, drawer,
   theme toggle, and filtering still work. Content simply appears without
   entrance animation. */
if (!window.gsap) {
  (function () {
    var chain = {};
    ['to', 'from', 'fromTo', 'set', 'play', 'pause', 'kill'].forEach(function (m) {
      chain[m] = function () { return chain; };
    });
    window.gsap = {
      registerPlugin: function () {},
      timeline: function () { return chain; },
      to: function () { return chain; },
      from: function () { return chain; },
      fromTo: function () { return chain; },
      set: function () { return chain; }
    };
    window.ScrollTrigger = { create: function () {}, refresh: function () {} };
  })();
}
gsap.registerPlugin(ScrollTrigger);

/* ─── NAV scroll state ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', scrollY > 30);
}, { passive: true });

/* ─── MOBILE DRAWER NAV ─── */
const navToggle = document.getElementById('navToggle');
const navOverlay = document.getElementById('navOverlay');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');

function closeMobileNav() {
  nav?.classList.remove('menu-open');
  document.body.classList.remove('nav-lock');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open menu');
  mobileDrawer?.setAttribute('aria-hidden', 'true');
}
function openMobileNav() {
  nav?.classList.add('menu-open');
  document.body.classList.add('nav-lock');
  navToggle?.setAttribute('aria-expanded', 'true');
  navToggle?.setAttribute('aria-label', 'Close menu');
  mobileDrawer?.setAttribute('aria-hidden', 'false');
}
if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.contains('menu-open') ? closeMobileNav() : openMobileNav();
  });
  drawerClose?.addEventListener('click', closeMobileNav);
  navOverlay?.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.drawer-links a, .drawer-demo, .drawer-logo').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMobileNav();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });
}

/* ─── LIGHT / DARK MODE TOGGLE ─── */
(function () {
  const root = document.documentElement;
  function getCurrentTheme() { return root.getAttribute('data-theme') || 'light'; }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('aksharum-theme', theme);
    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('#themeToggle, #drawerThemeToggle').forEach((btn) => {
      btn.setAttribute('aria-label', label);
    });
    const drawerText = document.querySelector('.drawer-theme-text');
    if (drawerText) drawerText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }
  function toggleTheme() {
    applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
  }
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getCurrentTheme());
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    document.getElementById('drawerThemeToggle')?.addEventListener('click', toggleTheme);
  });
})();

/* ─── HERO + SECTION ENTRANCE ANIMATIONS ─── */
gsap.set('#bhEy, #bhTitle, #bhSub, #bhSearchForm', { autoAlpha: 0, y: 18 });
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl.to('#bhEy', { autoAlpha: 1, y: 0, duration: .55 }, .1)
      .to('#bhTitle', { autoAlpha: 1, y: 0, duration: .75 }, '-=.35')
      .to('#bhSub', { autoAlpha: 1, y: 0, duration: .65 }, '-=.5')
      .to('#bhSearchForm', { autoAlpha: 1, y: 0, duration: .6 }, '-=.4');

gsap.fromTo('#fsCard', { opacity: 0, y: 36 },
  { opacity: 1, y: 0, duration: .9, ease: 'power3.out',
    scrollTrigger: { trigger: '#featStorySec', start: 'top 80%', once: true } });

gsap.fromTo('.cat-chip', { opacity: 0, y: 14 },
  { opacity: 1, y: 0, duration: .5, stagger: .04, ease: 'power3.out',
    scrollTrigger: { trigger: '#catSec', start: 'top 88%', once: true } });

gsap.fromTo('#latestHd', { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: '#latestSec', start: 'top 82%', once: true } });

gsap.fromTo('#blogGrid .blog-card:not(.pg-extra)', { opacity: 0, y: 40 },
  { opacity: 1, y: 0, duration: .75, stagger: .1, ease: 'power3.out',
    scrollTrigger: { trigger: '#blogGrid', start: 'top 82%', once: true } });

gsap.fromTo('#popularHd', { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: '#popularSec', start: 'top 82%', once: true } });

gsap.fromTo('.pop-lead, .pop-item', { opacity: 0, y: 30 },
  { opacity: 1, y: 0, duration: .75, stagger: .08, ease: 'power3.out',
    scrollTrigger: { trigger: '.popular-grid', start: 'top 82%', once: true } });

gsap.fromTo('#newsSec .news-inner', { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: '#newsSec', start: 'top 85%', once: true } });

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll('.n-demo, .fs-cta, .load-more-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) * .15;
    const dy = (e.clientY - r.top - r.height / 2) * .15;
    gsap.to(btn, { x: dx, y: dy, duration: .3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () =>
    gsap.to(btn, { x: 0, y: 0, duration: .55, ease: 'elastic.out(1,.5)' })
  );
});

/* ════════════════════════════════════════════════════════════════
   BLOG FILTERING — category chips + search + load more + empty state
   ════════════════════════════════════════════════════════════════ */
(function () {
  const blogGrid = document.getElementById('blogGrid');
  const blogEmpty = document.getElementById('blogEmpty');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const resetBtn = document.getElementById('blogResetBtn');
  const catChips = Array.from(document.querySelectorAll('.cat-chip'));
  const searchInput = document.getElementById('blogSearch');
  const searchForm = document.getElementById('bhSearchForm');
  const quickTags = document.querySelectorAll('.bh-tags a[data-quick]');

  if (!blogGrid) return;

  const state = { cat: 'all', term: '' };
  let loadedMore = false;

  function cardMatches(card) {
    const cardCat = card.dataset.cat || '';
    const matchCat = state.cat === 'all' || cardCat === state.cat;
    if (!matchCat) return false;
    if (!state.term) return true;
    const haystack = ((card.dataset.title || '') + ' ' + (card.dataset.excerpt || '')).toLowerCase();
    return haystack.includes(state.term);
  }

  function render() {
    const isDefault = state.cat === 'all' && state.term === '';
    const cards = Array.from(blogGrid.querySelectorAll('.blog-card'));
    let visible = 0;

    cards.forEach(card => {
      let show;
      if (isDefault) {
        show = !card.classList.contains('pg-extra') || loadedMore;
      } else {
        show = cardMatches(card);
      }
      card.style.display = show ? 'flex' : 'none';
      if (show) visible++;
    });

    loadMoreWrap.style.display = (isDefault && !loadedMore) ? 'block' : 'none';
    blogEmpty.hidden = visible !== 0;
    blogGrid.style.display = visible === 0 ? 'none' : 'grid';
  }

  function setActiveChip(cat) {
    catChips.forEach(chip => chip.classList.toggle('active', chip.dataset.cat === cat));
  }

  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      state.cat = chip.dataset.cat;
      setActiveChip(state.cat);
      render();
    });
  });

  let debounce;
  searchInput?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.term = searchInput.value.trim().toLowerCase();
      render();
    }, 150);
  });

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.term = searchInput.value.trim().toLowerCase();
    render();
    document.getElementById('latestSec')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  quickTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      const q = tag.dataset.quick || '';
      if (searchInput) searchInput.value = q;
      state.term = q.toLowerCase();
      state.cat = 'all';
      setActiveChip('all');
      render();
      document.getElementById('latestSec')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  resetBtn?.addEventListener('click', () => {
    state.cat = 'all';
    state.term = '';
    if (searchInput) searchInput.value = '';
    setActiveChip('all');
    render();
  });

  loadMoreBtn?.addEventListener('click', () => {
    if (loadMoreBtn.disabled) return;
    loadMoreBtn.classList.add('is-loading');
    loadMoreBtn.disabled = true;

    const skeletons = [];
    for (let i = 0; i < 3; i++) {
      const sk = document.createElement('div');
      sk.className = 'skeleton-card';
      sk.innerHTML = '<div class="skel-media"></div><div class="skel-line w80"></div><div class="skel-line w60"></div><div class="skel-line last" style="width:40%"></div>';
      blogGrid.appendChild(sk);
      skeletons.push(sk);
    }

    setTimeout(() => {
      skeletons.forEach(sk => sk.remove());
      loadedMore = true;
      loadMoreBtn.classList.remove('is-loading');
      loadMoreBtn.disabled = false;
      render();

      const newCards = blogGrid.querySelectorAll('.blog-card.pg-extra');
      gsap.fromTo(newCards, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, stagger: .1, ease: 'power3.out' });
    }, 650);
  });

  render();
})();

/* ─── NEWSLETTER FORM (front-end only) ─── */
document.getElementById('newsForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const note = document.getElementById('newsNote');
  const input = this.querySelector('input[type="email"]');
  if (note && input && input.value) {
    note.textContent = 'Thanks for subscribing! Check your inbox to confirm.';
    input.value = '';
  }
});
