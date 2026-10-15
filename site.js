// Small enhancements: click-to-enlarge images, slide deck buttons, and calmer
// video for people who ask their system for reduced motion.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    document.querySelectorAll('video[autoplay]').forEach((v) => {
      v.removeAttribute('autoplay');
      v.pause();
      v.controls = true;
    });
  }

  document.querySelectorAll('[data-deck]').forEach((deck) => {
    const track = deck.querySelector('.deck-track');
    const slides = [...track.children];
    const count = deck.querySelector('[data-count]');
    const prev = deck.querySelector('[data-prev]');
    const next = deck.querySelector('[data-next]');
    const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
    const index = () => Math.round(track.scrollLeft / step());
    const go = (i) => track.scrollTo({ left: i * step(), behavior: reduce ? 'auto' : 'smooth' });
    const update = () => {
      const i = Math.min(index(), slides.length - 1);
      count.textContent = `${i + 1} / ${slides.length}`;
      prev.disabled = i <= 0;
      next.disabled = i >= slides.length - 1;
    };
    prev.addEventListener('click', () => go(index() - 1));
    next.addEventListener('click', () => go(index() + 1));
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index() - 1); }
    });
    update();
  });

  const box = document.createElement('dialog');
  box.className = 'lightbox';
  box.innerHTML = '<button type="button" class="round lb-close" aria-label="Close">×</button><img alt="">';
  document.body.append(box);
  const big = box.querySelector('img');
  document.addEventListener('click', (e) => {
    const img = e.target.closest('figure[data-zoom].filled')?.querySelector('img');
    if (!img) return;
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    box.showModal();
  });
  box.addEventListener('click', () => box.close());
})();
