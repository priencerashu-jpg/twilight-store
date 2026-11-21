(() => {
  const header = document.querySelector('.premium-header');
  const navigation = header?.querySelector('.site-nav');
  const catalogLink = navigation?.querySelector('a[href$="products.html"]');
  const categoryLinks = document.querySelectorAll('.premium-footer a[href*="products.html?category="]');
  if (catalogLink && categoryLinks.length) {
    const menu = document.createElement('div');
    menu.className = 'collection-menu';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'collection-toggle';
    toggle.setAttribute('aria-label', 'Product categories');
    toggle.setAttribute('aria-controls', 'collection-menu-links');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span aria-hidden="true"></span>';
    const panel = document.createElement('div');
    panel.className = 'collection-links';
    panel.id = 'collection-menu-links';
    panel.hidden = true;
    catalogLink.before(menu);
    menu.append(catalogLink, toggle, panel);
    categoryLinks.forEach(link => panel.append(link.cloneNode(true)));
    const finePointer = matchMedia('(min-width:1021px) and (hover:hover) and (pointer:fine)');
    function setMenu(open) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    }
    toggle.addEventListener('click', () => setMenu(panel.hidden));
    catalogLink.addEventListener('pointerenter', () => { if (finePointer.matches) setMenu(true); });
    menu.addEventListener('pointerleave', () => {
      if (finePointer.matches && !menu.contains(document.activeElement)) setMenu(false);
    });
    menu.addEventListener('focusout', event => {
      if (event.relatedTarget && !menu.contains(event.relatedTarget)) setMenu(false);
    });
    menu.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || panel.hidden) return;
      setMenu(false);
      toggle.focus();
    });
    document.addEventListener('pointerdown', event => {
      if (!menu.contains(event.target)) setMenu(false);
    });
  }

  const hero = document.querySelector('.premium-hero');
  if (!hero) return;
  const showcase = hero.querySelector('.hero-showcase');
  const controls = showcase?.querySelector('.showcase-controls');
  if (!controls || !showcase.classList.contains('showcase-enhanced')) return;
  const slides = [...showcase.querySelectorAll('.showcase-card')];
  const status = controls.querySelector('[data-slide-status]');
  const caption = document.createElement('div');
  caption.className = 'edition-caption';
  const captionLabel = document.createElement('small');
  const captionName = document.createElement('strong');
  caption.append(captionLabel, captionName);
  status.after(caption);
  const progress = document.createElement('span');
  progress.className = 'edition-progress';
  progress.setAttribute('aria-hidden', 'true');
  showcase.append(progress);

  const picker = document.createElement('dialog');
  picker.className = 'edition-index';
  picker.setAttribute('aria-label', 'Product collection');
  const heading = document.createElement('div');
  heading.className = 'edition-index-heading';
  const title = document.createElement('h2');
  title.textContent = 'Product collection';
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Close';
  close.addEventListener('click', () => picker.close());
  heading.append(title, close);
  const grid = document.createElement('div');
  grid.className = 'edition-index-grid';
  picker.append(heading, grid);
  const browse = document.createElement('button');
  browse.type = 'button';
  browse.className = 'edition-browse';
  browse.textContent = 'Browse products';
  controls.querySelector('.showcase-actions').prepend(browse);
  showcase.append(picker);
  browse.addEventListener('click', () => picker.showModal());
  const play = controls.querySelector('[data-slide-play]');
  function pause() {
    if (play.getAttribute('aria-label') === 'Pause slideshow') play.click();
  }
  slides.forEach((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    const photo = slide.querySelector('img').cloneNode();
    photo.alt = '';
    photo.loading = 'lazy';
    button.append(photo, slide.querySelector('strong').textContent);
    button.addEventListener('click', () => {
      pause();
      const active = slides.findIndex(item => !item.hidden);
      for (let step = active; step !== index; step += Math.sign(index - active)) {
        controls.querySelector(step < index ? '[data-slide-next]' : '[data-slide-prev]').click();
      }
      picker.close();
    });
    grid.append(button);
  });
  function updateCaption() {
    const active = slides.findIndex(slide => !slide.hidden);
    if (active < 0) return;
    captionLabel.textContent = slides[active].querySelector('span').textContent;
    captionName.textContent = slides[active].querySelector('strong').textContent;
    const step = (active + 1) / slides.length;
    progress.style.transform = `scaleX(${step})`;
  }
  new MutationObserver(updateCaption).observe(status, { childList: true });
  updateCaption();
  let touch;
  let suppressClick = false;
  showcase.addEventListener('touchstart', event => {
    touch = event.touches.length === 1 && event.target.closest('.showcase-card')
      ? [event.touches[0].clientX, event.touches[0].clientY] : null;
  }, { passive: true });
  showcase.addEventListener('touchend', event => {
    if (!touch) return;
    const delta = event.changedTouches[0].clientX - touch[0];
    const vertical = event.changedTouches[0].clientY - touch[1];
    touch = null;
    if (Math.abs(delta) < 45 || Math.abs(delta) < Math.abs(vertical) * 1.5) return;
    suppressClick = true;
    pause();
    controls.querySelector(delta < 0 ? '[data-slide-next]' : '[data-slide-prev]').click();
    setTimeout(() => { suppressClick = false; }, 400);
  }, { passive: true });
  showcase.addEventListener('click', event => {
    if (suppressClick && event.target.closest('.showcase-card')) event.preventDefault();
  }, true);
  showcase.addEventListener('keydown', event => {
    if (picker.open || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const inSlide = event.target.closest('.showcase-card');
    pause();
    controls.querySelector(event.key === 'ArrowRight' ? '[data-slide-next]' : '[data-slide-prev]').click();
    if (inSlide) slides.find(slide => !slide.hidden).focus();
  });
  hero.classList.add('twilight-edition');
})();
