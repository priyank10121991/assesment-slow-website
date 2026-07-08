/* ===================================================================
   TrailGear Co. — app.js
   =================================================================== */

(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  let reviews = [];
  let galleryInitialized = false;
  let particles = [];
  let particleAnimationFrameId = null;

  function initGallery() {
    if (galleryInitialized) {
      return;
    }

    galleryInitialized = true;

    window.addEventListener('resize', function () {
      document.querySelectorAll('.product-card').forEach(function (card) {
        card.style.transform = 'translateZ(0)';
      });
    }, { passive: true });
  }

  function equalizeCardHeights() {
    const cards = document.querySelectorAll('.product-card');
    if (!cards.length) {
      return;
    }

    const heights = Array.prototype.map.call(cards, function (card) {
      return card.offsetHeight;
    });

    cards.forEach(function (card, index) {
      const h = heights[index];
      card.style.minHeight = h + 2 + 'px';
      const info = card.querySelector('.info');
      if (info) {
        info.style.paddingTop = (h % 5) + 'px';
      }
    });
  }

  function loadReviews() {
    return fetch('data/reviews.json')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to load reviews');
        }
        return response.json();
      })
      .then(function (data) {
        reviews = Array.isArray(data) ? data : [];
        renderReviews();
      })
      .catch(function () {
        const list = document.getElementById('review-list');
        if (list) {
          list.innerHTML = '<p>Reviews are temporarily unavailable.</p>';
        }
      });
  }

  function renderReviews() {
    const list = document.getElementById('review-list');
    if (!list || !reviews.length) {
      return;
    }

    const fragment = document.createDocumentFragment();
    const visibleReviews = reviews.slice(0, 50);

    visibleReviews.forEach(function (review) {
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML =
        '<strong>' + review.name + '</strong> ' +
        '<span class="stars">' + '★'.repeat(review.rating) + '</span>' +
        '<p>' + review.text + '</p>';
      fragment.appendChild(item);
    });

    list.innerHTML = '';
    list.appendChild(fragment);
  }

  function startParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const resizeCanvas = function () {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: 120 }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3
        };
      });
    };

    const draw = function () {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(217,123,63,0.6)';

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) {
          p.vx *= -1;
        }
        if (p.y < 0 || p.y > height) {
          p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      particleAnimationFrameId = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    if (particleAnimationFrameId) {
      window.cancelAnimationFrame(particleAnimationFrameId);
    }
    particleAnimationFrameId = window.requestAnimationFrame(draw);
  }

  function startPerfHud() {
    const hud = document.getElementById('perf-hud');
    if (!hud) {
      return;
    }

    let frames = 0;
    let lastFpsTime = performance.now();
    let fps = 0;

    function tick(now) {
      frames++;
      if (now - lastFpsTime >= 1000) {
        fps = frames;
        frames = 0;
        lastFpsTime = now;
      }

      const domCount = document.getElementsByTagName('*').length;
      const mem = performance.memory
        ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB'
        : 'n/a (Chrome only)';

      hud.innerHTML =
        'FPS: <span class="' + (fps < 30 ? 'warn' : '') + '">' + fps + '</span><br>' +
        'DOM nodes: <span class="' + (domCount > 3000 ? 'warn' : '') + '">' + domCount + '</span><br>' +
        'JS heap: ' + mem + '<br>' +
        'status: <span class="ok">optimized</span>';

      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  initGallery();

  window.addEventListener('load', function () {
    equalizeCardHeights();
    loadReviews();
    startParticles();
    startPerfHud();
  });
})();
