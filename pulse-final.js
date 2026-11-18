(() => {
  'use strict';
  // Draw the frame in actual CSS pixels; chamfers stay consistent on every screen.
  const contours = [...document.querySelectorAll('.media-contour')];
  const frames = new ResizeObserver(entries => entries.forEach(({ target }) => {
    const svg = target.querySelector('.media-contour');
    if (!svg) return;
    const w = target.clientWidth, h = target.clientHeight, cut = 24;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.querySelector('.contour').setAttribute('d', `M1 1H${w-cut}L${w-1} ${cut}V${h-1}H${cut}L1 ${h-cut}Z`);
    svg.querySelector('.accent').setAttribute('d', `M${w*.62} 1H${w-cut-12}M${w-1} ${cut+12}V${Math.min(h*.45,cut+55)}M${cut+12} ${h-1}H${w*.3}`);
    svg.querySelector('.detail').setAttribute('d', `M6 47V6H90M${w-90} ${h-6}H${w-6}V${h-47}`);
  }));
  contours.forEach(svg => frames.observe(svg.parentElement));
  const scenes = {
    'black-hole': { src: 'assets/visual-guide-black-hole.png', alt: 'JARVIS Visual Guide with a pixel-art black hole, chart, formation timeline and flow diagram.', caption: 'A black hole, explained across a model, chart and timeline.' },
    dna: { src: 'assets/visual-guide-dna.png', alt: 'A DNA double helix in the JARVIS Visual Guide, with labels for the helical strand and base pair.', caption: 'A closer look: the DNA model and its connected annotations.' }
  };
  document.querySelectorAll('[data-guide-scene]').forEach(button => button.addEventListener('click', () => {
    const scene = scenes[button.dataset.guideScene];
    document.querySelectorAll('[data-guide-scene]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const image = document.querySelector('[data-guide-image]');
    image.src = scene.src; image.alt = scene.alt;
    document.querySelector('[data-guide-caption]').textContent = scene.caption;
  }));
  document.querySelector('[data-copy-source]')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    const text = document.querySelector('[data-source-command]').textContent;
    const status = document.querySelector('[data-copy-status]');
    try { await navigator.clipboard.writeText(text); status.textContent = 'Copied.'; }
    catch { const range = document.createRange(); range.selectNodeContents(document.querySelector('[data-source-command]')); getSelection().removeAllRanges(); getSelection().addRange(range); status.textContent = 'Selected. Press Ctrl+C to copy.'; }
    button.textContent = 'Copy again';
  });
  addEventListener('pagehide', () => frames.disconnect(), { once: true });
})();
