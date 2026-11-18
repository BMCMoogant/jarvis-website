/** All media replacements live here. Empty video URLs render their poster. */
window.JARVIS_MEDIA = {
  github: '',
  installer: '',
  hero: {
    video: 'assets/films/desktop-scrub.mp4',
    poster: 'assets/films/desktop-poster.jpg',
    start: 0,
    end: 47.7,
    frames: { prefix: 'assets/films/frames/desktop-', count: 289, fps: 6 },
  },
  slots: {
    computer: { video: '', image: 'assets/jarvis-focus-workspace.png', caption: 'Desktop overview preview', position: '50% 45%' },
    voice: { video: 'assets/films/desktop-scrub.mp4', image: 'assets/films/desktop-poster.jpg', caption: 'JARVIS Core in motion', position: '50% 40%' },
    research: { video: '', image: 'assets/jarvis-focus-workspace.png', caption: 'Context and analysis preview', position: '75% 45%' },
    holo: { video: '', image: 'assets/jarvis-focus-workspace.png', caption: 'Layered workspace preview', position: '50% 45%' },
    focus: { video: '', image: 'assets/jarvis-desktop-overview.png', caption: 'Desktop overview preview', position: '5% 55%' },
    documents: { video: '', image: 'assets/jarvis-focus-workspace.png', caption: 'Document workspace preview', position: '50% 50%' },
  },
};
