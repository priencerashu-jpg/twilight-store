(function () {
  var isProductPage = document.body.hasAttribute('data-product');
  var pathPrefix = isProductPage ? '../../' : '';

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      });
    });
  }

  var visitorTarget = document.querySelector('[data-product-visitor]');
  if (visitorTarget) {
    var visitorImage = document.createElement('img');
    visitorImage.src = 'https://hits.sh/twilight-market.priencerashu.chatgpt.site.svg?style=flat-square&label=Website%20visits&color=123c2e&labelColor=202722';
    visitorImage.alt = 'Website visit count';
    visitorImage.loading = 'eager';
    visitorImage.addEventListener('error', function () {
      visitorTarget.textContent = 'Website visits unavailable';
    });
    visitorTarget.appendChild(visitorImage);
  }

  document.querySelectorAll('[data-year]').forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  var searchToggle = document.querySelector('[data-search-toggle]');
  var searchOverlay;
  var searchInput;

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.hidden = true;
    document.body.classList.remove('search-open');
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
  }

  function filterProducts(query) {
    var grid = document.querySelector('[data-product-grid]');
    if (!grid) return false;
    var normalized = (query || '').trim().toLowerCase();
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-product-card]'));
    var visible = 0;
    cards.forEach(function (card) {
      var matches = !normalized || card.textContent.toLowerCase().indexOf(normalized) !== -1;
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    var result = document.querySelector('[data-product-results]');
    var empty = document.querySelector('[data-search-empty]');
    if (result) result.textContent = normalized ? visible + (visible === 1 ? ' matching product' : ' matching products') : cards.length + ' products';
    if (empty) empty.hidden = visible !== 0;
    return true;
  }

  function createSearch() {
    if (searchOverlay) return;
    searchOverlay = document.createElement('div');
    searchOverlay.className = 'site-search-overlay';
    searchOverlay.hidden = true;
    searchOverlay.innerHTML = '<div class="site-search-dialog" role="dialog" aria-modal="true" aria-label="Search products"><button type="button" class="search-close" aria-label="Close search">×</button><span>SEARCH THE COLLECTION</span><h2>What are you looking for?</h2><form><input type="search" name="q" autocomplete="off" placeholder="Try raincoat, fan, gift set..." aria-label="Search products"><button type="submit">Search</button></form><small>Search by product, category or feature.</small></div>';
    document.body.appendChild(searchOverlay);
    searchInput = searchOverlay.querySelector('input');
    searchOverlay.querySelector('.search-close').addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', function (event) {
      if (event.target === searchOverlay) closeSearch();
    });
    searchOverlay.querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      var query = searchInput.value.trim();
      if (filterProducts(query)) {
        var nextUrl = query ? 'products.html?q=' + encodeURIComponent(query) : 'products.html';
        window.history.replaceState({}, '', nextUrl);
        closeSearch();
      } else {
        window.location.href = pathPrefix + 'products.html' + (query ? '?q=' + encodeURIComponent(query) : '');
      }
    });
  }

  if (searchToggle) {
    searchToggle.setAttribute('aria-expanded', 'false');
    searchToggle.addEventListener('click', function () {
      createSearch();
      searchOverlay.hidden = false;
      document.body.classList.add('search-open');
      searchToggle.setAttribute('aria-expanded', 'true');
      window.setTimeout(function () { searchInput.focus(); }, 20);
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeSearch();
  });

  var initialQuery = '';
  try { initialQuery = new URLSearchParams(window.location.search).get('q') || ''; } catch (error) {}
  if (document.querySelector('[data-product-grid]')) filterProducts(initialQuery);
  var clearSearch = document.querySelector('[data-clear-search]');
  if (clearSearch) {
    clearSearch.addEventListener('click', function () {
      filterProducts('');
      window.history.replaceState({}, '', 'products.html');
    });
  }

  var COOKIE_KEY = 'twilight-cookie-notice-v1';
  var cookieAccepted = false;
  try { cookieAccepted = window.localStorage.getItem(COOKIE_KEY) === 'accepted'; } catch (error) {}
  if (!cookieAccepted) {
    var notice = document.createElement('aside');
    notice.className = 'cookie-notice';
    notice.setAttribute('aria-label', 'Privacy notice');
    notice.innerHTML = '<div><strong>Your privacy at Twilight</strong><p>This site uses browser storage to remember your cart and TikTok Pixel to understand website visits.</p></div><a href="' + pathPrefix + 'privacy.html">Learn more</a><button type="button">Understood</button>';
    document.body.appendChild(notice);
    notice.querySelector('button').addEventListener('click', function () {
      try { window.localStorage.setItem(COOKIE_KEY, 'accepted'); } catch (error) {}
      notice.remove();
    });
  }
}());
