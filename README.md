# HAM-VLN project page

This is the single-page website for **HAM-VLN: Harnessing Hierarchical Agentic Memory for Zero-Shot Vision-and-Language Navigation**.

The published preprint is available at https://arxiv.org/abs/2607.29600. The Code control on the page intentionally says **Coming soon** until a public repository URL is available.

## Preview locally

From this directory, run:

    python3 -m http.server 8765

Then open http://127.0.0.1:8765/.

The page is plain HTML, CSS, and JavaScript. Its content is in index.html, layout in static/css/index.css, and lightbox/demo behavior in static/js/index.js. MathJax typesets the equations and numerical results from TeX expressions.

## Adding a video demo

See static/videos/DEMO_INSTRUCTIONS.md. Add video entries in static/js/demo-config.js; the Demo section remains hidden until at least one entry has a video source.

## Research assets and data

The figures used on the page are assets/dence.png, assets/pipeline.png, assets/memory.png, and assets/episode.png. Results were transcribed from the paper's tables in HAM-VLN/tables/. The unrelated assets/teaser.png and the template's sample videos are intentionally unused.

The repository includes the paper source and PDF under HAM-VLN/. The webpage does not claim a conference venue.
