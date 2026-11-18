# J.A.R.V.I.S. — Pulse

The official product website for J.A.R.V.I.S., an open-source Windows desktop assistant.

**Website:** https://bmcmoogant.github.io/jarvis-website/

## Preview locally

Serve this directory with any static HTTP server, for example:

```sh
python -m http.server 8000
```

Open http://localhost:8000. No framework installation or build step is required.

## Update the site

Edit index.html and the accompanying CSS/JavaScript. Push to main; GitHub Pages serves the root directory. pulse.html redirects old bookmarks to the main site. Only the Pulse design is published.

## Product media

- assets/films/desktop-scrub.mp4 — real desktop recording; replace with an H.264 MP4.
- assets/films/desktop-poster.jpg — its first-frame poster.
- assets/jarvis-focus-workspace.png — sources, context and projected panels.
- assets/visual-guide-black-hole.png — full Visual Guide workspace.
- assets/visual-guide-dna.png — close-up of a labeled DNA model.
- assets/desktop-live-detail.png — live desktop and Computer Use panel.

Preserve original capture proportions. Capture the whole product workspace without browser chrome or the Windows taskbar; record 15–30 seconds at 1080p or higher, with no private data. Use a wider shot for the interface and a close-up for readable model details. Replace file contents in place to retain existing placement. If a filename changes, update index.html and pulse-final.js.

## Behavior

ASCII and dot artwork, the original fluid pointer trail, horizontal desktop narrative on larger screens, vertical mobile/reduced-motion fallback, fullscreen media, accessible Visual Guide scene buttons, offscreen video pausing and a copyable source command.

## Release links

The desktop application's repository and Windows installer are not published by this website. The download area links to the creator's GitHub profile and this website's real source. Update those links when an actual application release is ready.

## Credits

Product interface, screenshots and supplied branding belong to the creator. GSAP is bundled in assets/vendor; Google Workspace marks identify the corresponding third-party products. Preserve upstream notices.
