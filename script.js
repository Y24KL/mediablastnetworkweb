/* ==========================================================================
   MediaBlast Network — site scripts
   ========================================================================== */

var MB_API_BASE = (window.MB_CONFIG && window.MB_CONFIG.API_BASE) || '';

function getYouTubeID(url) {
  if (!url) return null;
  var match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return (match && match[2].length === 11) ? match[2] : null;
}

/* Fetch the shared backend's public Network content, falling back to null
   (callers keep whatever static content is already in the page) so the
   site still works if the backend is unreachable. */
function fetchNetworkContent() {
  if (!MB_API_BASE) return Promise.resolve(null);
  return fetch(MB_API_BASE + '/api/network/content')
    .then(function (res) { return res.ok ? res.json() : null; })
    .catch(function () { return null; });
}

function initLoader() {
  var loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.style.opacity = '0';
      setTimeout(function () { loader.style.display = 'none'; }, 500);
    }, 400);
  });
}

function initSideMenu() {
  var menuToggle = document.getElementById('menu-toggle');
  var closeMenu = document.getElementById('close-menu');
  var sideMenu = document.getElementById('side-menu');
  var overlay = document.getElementById('menu-overlay');
  if (!menuToggle || !sideMenu || !overlay) return;

  menuToggle.addEventListener('click', function () {
    sideMenu.classList.add('active');
    overlay.classList.add('active');
  });

  [closeMenu, overlay].forEach(function (el) {
    if (!el) return;
    el.addEventListener('click', function () {
      sideMenu.classList.remove('active');
      overlay.classList.remove('active');
    });
  });
}

function initSocialFloat() {
  var socialFloat = document.getElementById('social-float');
  if (!socialFloat) return;
  var trigger = socialFloat.querySelector('.social-trigger');
  if (!trigger) return;
  trigger.addEventListener('click', function () { socialFloat.classList.toggle('active'); });
}

function initNavbarScroll() {
  var nav = document.querySelector('.navbar');
  if (!nav) return;
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 50); };
  window.addEventListener('scroll', onScroll);
  onScroll();
}

function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.12 });
  reveals.forEach(function (el) { observer.observe(el); });
}

/* ---------------- Program preview modal (index.html + programs.html) ---------------- */
function initProgramModal() {
  var modal = document.getElementById('programModal');
  if (!modal) return;
  var modalPreview = document.getElementById('modalPreview');
  var modalTitle = document.getElementById('modalTitle');
  var modalDescription = document.getElementById('modalDescription');
  var closeModal = modal.querySelector('.close-modal');

  function openFromCard(card) {
    var video = card.dataset.video;
    var image = card.dataset.previewImg;
    modalTitle.textContent = card.dataset.title || '';
    modalDescription.textContent = card.dataset.description || '';
    modalPreview.innerHTML = '';

    if (video) {
      modalPreview.innerHTML = '<iframe src="' + video + '" title="' + (card.dataset.title || 'Preview') +
        '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    } else if (image) {
      modalPreview.innerHTML = '<img src="' + image + '" alt="">';
    }
    modal.style.display = 'flex';
  }

  document.addEventListener('click', function (e) {
    var card = e.target.closest('[data-title]');
    if (card) openFromCard(card);
  });

  function close() {
    modal.style.display = 'none';
    modalPreview.innerHTML = '';
  }

  if (closeModal) closeModal.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
}

/* ---------------- Dynamic program cards (fed from the shared backend) ---------------- */
function programCardHTML(program) {
  var tagHTML = program.tag ? '<span class="live-tag">' + program.tag + '</span>' : '';
  return (
    '<div class="program-card glass" data-video="' + (program.videoUrl || '') +
    '" data-preview-img="' + (program.imageUrl || '') +
    '" data-title="' + program.title +
    '" data-description="' + (program.description || '') + '">' +
    '<div class="card-img" style="background-image:url(\'' + program.imageUrl + '\')">' + tagHTML + '</div>' +
    '<div class="card-body"><h3>' + program.title + '</h3><p>' + (program.description || '') + '</p></div>' +
    '</div>'
  );
}

function renderProgramsInto(selector, programs, wrapInLink) {
  var container = document.querySelector(selector);
  if (!container || !programs || !programs.length) return;
  container.innerHTML = programs.map(function (program) {
    var card = programCardHTML(program);
    return wrapInLink ? '<a href="programs.html" class="program-card-link">' + card + '</a>' : card;
  }).join('');
}

function applyHeroContent(hero) {
  if (!hero) return;
  // The hero <h1> keeps its static two-line/gradient markup (a plain-text
  // CMS field can't safely represent that), so only the tagline and CTA —
  // both plain text — are wired to admin-managed content.
  var taglineEl = document.querySelector('[data-field="hero-tagline"]');
  var ctaEl = document.querySelector('[data-field="hero-cta"]');
  if (taglineEl && hero.tagline) taglineEl.textContent = hero.tagline;
  if (ctaEl) {
    if (hero.ctaText) ctaEl.textContent = hero.ctaText;
    if (hero.ctaLink) ctaEl.setAttribute('href', hero.ctaLink);
  }
}

/* ---------------- Contact form (Formspree) ---------------- */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;
  var status = document.getElementById('form-status');

  if (window.MB_CONFIG && window.MB_CONFIG.FORMSPREE_FORM_ID) {
    form.setAttribute('action', 'https://formspree.io/f/' + window.MB_CONFIG.FORMSPREE_FORM_ID);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    if (status) {
      status.className = '';
      status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message…';
    }

    fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!status) return;
        if (res.ok) {
          status.className = 'success';
          status.textContent = 'Message sent — thank you!';
          form.reset();
        } else {
          status.className = 'error';
          status.textContent = 'Something went wrong. Please try again.';
        }
      })
      .catch(function () {
        if (status) {
          status.className = 'error';
          status.textContent = 'Connection error. Please check your network.';
        }
      });
  });
}

/* ---------------- Blog / News (placeholder content) ---------------- */
function initBlog() {
  var blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return;

  var blogData = [
    { title: 'Future of 8K Streaming', cat: 'tech', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800' },
    { title: 'Unfiltered News: Middle East', cat: 'media', img: 'https://images.unsplash.com/photo-1504711432869-5d592f239cff?auto=format&fit=crop&q=80&w=800' },
    { title: 'Mediablast Originals: 2026', cat: 'media', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800' },
  ];

  function render(filter, search) {
    filter = filter || 'all';
    search = (search || '').toLowerCase();
    blogGrid.innerHTML = '';
    blogData
      .filter(function (item) {
        return (filter === 'all' || item.cat === filter) && item.title.toLowerCase().includes(search);
      })
      .forEach(function (post) {
        var card = document.createElement('div');
        card.className = 'blog-card glass';
        card.innerHTML =
          '<div class="card-img" style="background-image:url(\'' + post.img + '\')"></div>' +
          '<div class="card-body"><span class="tag" style="position:static;display:inline-block;margin-bottom:8px;">' +
          post.cat.toUpperCase() + '</span><h3>' + post.title + '</h3><p>Latest insights from our digital newsroom.</p></div>';
        blogGrid.appendChild(card);
      });
  }

  render();

  var searchInput = document.getElementById('blogSearch');
  if (searchInput) searchInput.addEventListener('input', function (e) { render('all', e.target.value); });

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelector('.filter-btn.active').classList.remove('active');
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });
}

/* ---------------- Specials page (native, fed from the shared backend) ---------------- */
function galleryItemVideoUrl(item) {
  if (item.videoId) return 'https://www.youtube.com/embed/' + item.videoId;
  if (item.driveFileId) return 'https://drive.google.com/file/d/' + item.driveFileId + '/preview';
  return '';
}

function initSpecialsPage() {
  var gallery = document.getElementById('specialsGallery');
  var badge = document.getElementById('specialsStatusBadge');
  if (!gallery || !MB_API_BASE) return;

  fetch(MB_API_BASE + '/api/content')
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (content) {
      if (!content) return;

      if (badge && content.live) {
        var isLive = content.live.status === 'live';
        badge.textContent = isLive ? 'LIVE NOW' : 'OFFLINE';
        badge.className = 'status-badge ' + (isLive ? 'is-live' : 'is-offline');
      }

      if (content.gallery && content.gallery.length) {
        var shades = ['#384090,#0a0b1e', '#00a8e8,#384090', '#484848,#0a0b1e', '#384090,#00a8e8'];
        gallery.innerHTML = content.gallery.map(function (item, i) {
          var videoUrl = galleryItemVideoUrl(item);
          var bg = item.imageUrl
            ? "background-image:url('" + item.imageUrl + "');"
            : 'background:linear-gradient(135deg,' + shades[i % shades.length] + ');';
          return '<div class="specials-gallery-card" data-title="' + item.title +
            '" data-video="' + videoUrl + '" style="' + bg + '"><span>' + item.title + '</span></div>';
        }).join('');
      }
    })
    .catch(function () { /* keep static fallback markup already in the page */ });
}

document.addEventListener('DOMContentLoaded', function () {
  initLoader();
  initSideMenu();
  initSocialFloat();
  initNavbarScroll();
  initScrollReveal();
  initProgramModal();
  initContactForm();
  initBlog();
  initSpecialsPage();

  fetchNetworkContent().then(function (content) {
    if (!content) return;
    applyHeroContent(content.hero);
    if (content.programs && content.programs.length) {
      renderProgramsInto('#trendingPrograms', content.programs.slice(0, 4), true);
      renderProgramsInto('#programsGrid', content.programs, false);
    }
  });
});
