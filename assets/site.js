(function () {
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
    visitorImage.src = 'https://hits.sh/twilight-market.priencerashu.chatgpt.site.svg?style=flat-square&label=Website%20visits&color=0d5c35&labelColor=071128';
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
}());
