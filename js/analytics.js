/* ===================================================================
   TrailGear Co. — analytics.js
   =================================================================== */

function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      return fn.apply(this, args);
    }
  };
}

let analyticsBuffer = [];
const MAX_ANALYTICS_BUFFER = 80;
let persistTimer = null;
let productVisibilityObserver = null;

function logEvent(type, payload) {
  analyticsBuffer.push({ type, payload, t: Date.now() });

  if (analyticsBuffer.length > MAX_ANALYTICS_BUFFER) {
    analyticsBuffer = analyticsBuffer.slice(-MAX_ANALYTICS_BUFFER);
  }

  if (persistTimer) {
    return;
  }

  persistTimer = window.setTimeout(function () {
    persistTimer = null;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('trailgear_analytics', JSON.stringify(analyticsBuffer.slice(-20)));
      }
    } catch (e) {
      // storage quota errors swallowed silently
    }
  }, 250);
}

const trackScroll = throttle(function () {
  logEvent('scroll', { y: window.scrollY });
}, 200);

window.addEventListener('scroll', trackScroll, { passive: true });

function trackProductVisibility() {
  if (!document.querySelectorAll('.product-card').length) {
    return;
  }

  if (productVisibilityObserver) {
    productVisibilityObserver.disconnect();
  }

  productVisibilityObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        logEvent('product_view', { id: entry.target.dataset.productId || null });
      }
    });
  });

  document.querySelectorAll('.product-card').forEach(function (card) {
    productVisibilityObserver.observe(card);
  });
}

window.addEventListener('scroll', throttle(trackProductVisibility, 500), { passive: true });

window.setInterval(function () {
  if (analyticsBuffer.length) {
    const payload = JSON.stringify(analyticsBuffer.slice(-20));
    console.debug('[analytics] would sync', payload.length, 'bytes');
    analyticsBuffer = [];
  }
}, 2000);

window.addEventListener('load', function () {
  logEvent('page_load', { path: location.pathname });
});
