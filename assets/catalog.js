(function () {
  var input = document.querySelector('[data-product-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-product-card]'));
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-category-filter]'));
  var results = document.querySelector('[data-product-results]');
  var empty = document.querySelector('[data-shop-empty]');
  if (!input || !cards.length) return;

  var params = new URLSearchParams(window.location.search);
  var activeCategory = params.get('category') || 'all';

  function matchesCategory(card) {
    if (activeCategory === 'all') return true;
    return (card.getAttribute('data-category') || '').split('|').indexOf(activeCategory) !== -1;
  }

  function render() {
    var query = input.value.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var show = matchesCategory(card) && (!query || (card.getAttribute('data-search-text') || '').indexOf(query) !== -1);
      card.hidden = !show;
      if (show) visible += 1;
    });
    results.textContent = visible + (visible === 1 ? ' product' : ' products');
    empty.hidden = visible !== 0;
    filters.forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-category-filter') === activeCategory);
    });
  }

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      activeCategory = button.getAttribute('data-category-filter');
      render();
    });
  });
  input.addEventListener('input', render);
  if (!filters.some(function (button) { return button.getAttribute('data-category-filter') === activeCategory; })) activeCategory = 'all';
  render();
  if (window.location.hash === '#product-search') window.setTimeout(function () { input.focus(); }, 50);
}());
