(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const carousel = document.querySelector('.hero-showcase');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.showcase-card'));
    const controls = carousel.querySelector('.showcase-controls');
    const status = controls.querySelector('[data-slide-status]');
    const play = controls.querySelector('[data-slide-play]');
    const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let active = 0;
    let timer;
    let playing = !reduceMotion.matches;
    let visible = true;
    let hovering = false;
    let focused = false;

    function show(index, animate = true) {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, position) => {
        slide.hidden = position !== active;
      });
      status.textContent = `${active + 1} / ${slides.length}`;
      if (animate && !reduceMotion.matches && typeof slides[active].animate === 'function') {
        slides[active].animate([{ opacity: .28 }, { opacity: 1 }], {
          duration: 700, easing: 'cubic-bezier(.22,.61,.36,1)'
        });
      }
    }

    function schedule() {
      window.clearTimeout(timer);
      if (!playing || reduceMotion.matches || document.hidden || !visible || hovering || focused) return;
      timer = window.setTimeout(() => {
        show(active + 1);
        schedule();
      }, 6500);
    }

    function setPlaying(enabled) {
      playing = enabled;
      play.setAttribute('aria-label', enabled ? 'Pause slideshow' : 'Play slideshow');
      play.querySelector('span').textContent = enabled ? 'Ⅱ' : '▶';
      schedule();
    }

    controls.querySelector('[data-slide-prev]').addEventListener('click', () => {
      show(active - 1);
      schedule();
    });
    controls.querySelector('[data-slide-next]').addEventListener('click', () => {
      show(active + 1);
      schedule();
    });
    play.addEventListener('click', () => setPlaying(!playing));
    carousel.addEventListener('pointerenter', () => {
      hovering = hoverPointer.matches;
      schedule();
    });
    carousel.addEventListener('pointerleave', () => {
      hovering = false;
      schedule();
    });
    carousel.addEventListener('focusin', () => {
      focused = true;
      schedule();
    });
    carousel.addEventListener('focusout', event => {
      if (carousel.contains(event.relatedTarget)) return;
      focused = false;
      schedule();
    });
    document.addEventListener('visibilitychange', schedule);
    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', () => {
        play.hidden = reduceMotion.matches;
        if (reduceMotion.matches) setPlaying(false);
        schedule();
      });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        schedule();
      }).observe(carousel);
    }
    show(0, false);
    carousel.classList.add('showcase-enhanced');
    controls.hidden = false;
    play.hidden = reduceMotion.matches;
    setPlaying(playing);
  }

  const photoFrames = document.querySelectorAll('.showcase-card, .category-grid > a, .clean-product-card > a:first-child, .shop-card-image, .gallery-main');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  photoFrames.forEach(frame => {
    frame.classList.add('horizon-photo');
    frame.addEventListener('pointerenter', event => {
      if (!pointer.matches) return;
      const bounds = frame.getBoundingClientRect();
      frame.style.setProperty('--photo-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
      frame.style.setProperty('--photo-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
    });
  });

  if (!('IntersectionObserver' in window)) return;
  const arrivals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      arrivals.unobserve(entry.target);
      if (!reduceMotion.matches) entry.target.classList.add('horizon-arrived');
    });
  }, { threshold: .12 });
  document.querySelectorAll('.premium-heading, .category-grid > a, .clean-product-card, .shop-card, .story-banner, .selection-story').forEach(element => arrivals.observe(element));
})();
