document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('image-dialog');
  const dialogImage = dialog.querySelector('img');
  const closeButton = dialog.querySelector('.dialog-close');

  document.querySelectorAll('.figure-open').forEach((button) => {
    button.addEventListener('click', () => {
      dialogImage.src = button.dataset.image;
      dialogImage.alt = button.dataset.alt || '';
      dialog.showModal();
    });
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    dialogImage.removeAttribute('src');
  });

  const demoSection = document.getElementById('demo');
  const demoViewport = document.getElementById('demo-viewport');
  const demoTrack = document.getElementById('demo-track');
  const demoNav = document.getElementById('demo-nav');
  const demoPrev = document.getElementById('demo-prev');
  const demoNext = document.getElementById('demo-next');
  const demoDots = document.getElementById('demo-dots');
  const demos = (Array.isArray(window.HAM_DEMOS) ? window.HAM_DEMOS : [])
    .filter((item) => item && typeof item.src === 'string' && item.src.trim());

  demos.forEach((item, index) => {
    const slide = document.createElement('article');
    slide.className = 'demo-slide';
    slide.id = `demo-slide-${index}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${demos.length}`);

    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    video.src = item.src;
    if (item.poster) video.poster = item.poster;
    video.setAttribute('aria-label', item.title || 'HAM-VLN navigation demo');
    slide.append(video);

    const meta = document.createElement('div');
    meta.className = 'demo-meta';
    if (item.title) {
      const heading = document.createElement('h3');
      heading.textContent = item.title;
      meta.append(heading);
    }
    if (item.caption) {
      const caption = document.createElement('p');
      caption.textContent = item.caption;
      meta.append(caption);
    }
    slide.append(meta);
    demoTrack.append(slide);
  });

  if (demos.length) {
    demoSection.hidden = false;
    if (demoNav) demoNav.hidden = false;

    const multiple = demos.length > 1;
    if (!multiple) {
      demoPrev.hidden = true;
      demoNext.hidden = true;
    }

    const slides = Array.from(demoTrack.children);
    const dots = [];
    let current = 0;

    if (multiple) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'demo-dot';
        dot.setAttribute('aria-label', `Go to demo ${index + 1}`);
        dot.addEventListener('click', () => goTo(index));
        demoDots.append(dot);
        dots.push(dot);
      });
    } else {
      demoDots.hidden = true;
    }

    const pauseAll = () => {
      slides.forEach((slide) => {
        const video = slide.querySelector('video');
        if (video && !video.paused) video.pause();
      });
    };

    function goTo(index) {
      current = Math.max(0, Math.min(index, slides.length - 1));
      demoTrack.style.transform = `translateX(-${current * 100}%)`;
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        // Keep off-screen videos out of the tab order.
        slide.querySelectorAll('video').forEach((video) => {
          if (active) video.removeAttribute('tabindex');
          else video.setAttribute('tabindex', '-1');
        });
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
      pauseAll();
    }

    if (multiple) {
      demoPrev.addEventListener('click', () => goTo(current - 1));
      demoNext.addEventListener('click', () => goTo(current + 1));
      demoViewport.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goTo(current - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          goTo(current + 1);
        }
      });
      demoPrev.disabled = false;
      demoNext.disabled = false;
    }

    // Touch swipe for mobile.
    let touchStartX = null;
    demoViewport.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });
    demoViewport.addEventListener('touchend', (event) => {
      if (touchStartX === null || !multiple) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 45) goTo(delta < 0 ? current + 1 : current - 1);
      touchStartX = null;
    }, { passive: true });

    goTo(0);
  }
});
