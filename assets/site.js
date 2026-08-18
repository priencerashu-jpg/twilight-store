(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        nav.classList.remove('open');
      });
    });
  }

  var visitorTarget = document.querySelector('[data-product-visitor]');
  if (visitorTarget) {
    var visitorImage = document.createElement('img');
    visitorImage.src = 'https://hits.sh/twilight-market.priencerashu.chatgpt.site.svg?style=flat-square&label=Website%20visits&color=123b2d&labelColor=0a241b';
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

  var consentKey = 'twilight-market-analytics-consent';
  var privacyPrefix = document.body && document.body.hasAttribute('data-product') ? '../../' : '';

  function saveConsent(value) {
    try { window.localStorage.setItem(consentKey, value); } catch (error) {}
  }

  function readConsent() {
    try { return window.localStorage.getItem(consentKey); } catch (error) { return null; }
  }

  function loadTikTokPixel() {
    if (window.__twilightTikTokLoaded) return;
    window.__twilightTikTokLoaded = true;
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
      ttq.setAndDefer = function (object, method) {
        object[method] = function () { object.push([method].concat(Array.prototype.slice.call(arguments, 0))); };
      };
      for (var i = 0; i < ttq.methods.length; i += 1) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (id) {
        var instance = ttq._i[id] || [];
        for (var j = 0; j < ttq.methods.length; j += 1) ttq.setAndDefer(instance, ttq.methods[j]);
        return instance;
      };
      ttq.load = function (id, options) {
        var source = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i = ttq._i || {};
        ttq._i[id] = [];
        ttq._i[id]._u = source;
        ttq._t = ttq._t || {};
        ttq._t[id] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[id] = options || {};
        var script = d.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = source + '?sdkid=' + id + '&lib=' + t;
        var first = d.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
      };
      ttq.load('DA016D3C77UE58FDCOHG');
      ttq.page();
    }(window, document, 'ttq');
  }

  function closeConsent() {
    var existing = document.querySelector('[data-consent-banner]');
    if (existing) existing.remove();
  }

  function showConsent() {
    closeConsent();
    var banner = document.createElement('aside');
    banner.className = 'privacy-notice';
    banner.setAttribute('data-consent-banner', '');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Analytics preferences');
    banner.innerHTML = '<div><span>YOUR PRIVACY</span><strong>Choose how this website uses analytics.</strong><p>Your cart works without an account. TikTok analytics loads only if you allow it. <a href="' + privacyPrefix + 'privacy.html">Read our Privacy Policy</a>.</p></div><div class="privacy-actions"><button type="button" data-consent-decline>Continue without analytics</button><button type="button" data-consent-allow>Allow analytics</button></div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-consent-allow]').addEventListener('click', function () {
      saveConsent('allow');
      closeConsent();
      loadTikTokPixel();
      if (window.ttq && typeof window.ttq.grantConsent === 'function') window.ttq.grantConsent();
    });
    banner.querySelector('[data-consent-decline]').addEventListener('click', function () {
      saveConsent('deny');
      if (window.ttq && typeof window.ttq.revokeConsent === 'function') window.ttq.revokeConsent();
      closeConsent();
    });
  }

  document.querySelectorAll('[data-cookie-settings]').forEach(function (button) {
    button.addEventListener('click', showConsent);
  });

  var consent = readConsent();
  if (consent === 'allow') loadTikTokPixel();
  else if (consent !== 'deny') showConsent();
}());
