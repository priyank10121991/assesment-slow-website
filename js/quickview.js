/* ===================================================================
   TrailGear Co. — quickview.js
   =================================================================== */

const closedModalHistory = [];
let activeOverlay = null;

function closeQuickView(overlay) {
  if (!overlay) {
    return;
  }

  overlay.remove();
  if (activeOverlay === overlay) {
    activeOverlay = null;
  }

  closedModalHistory.push(overlay);
  if (closedModalHistory.length > 5) {
    closedModalHistory.shift();
  }
}

function openQuickView(card) {
  if (activeOverlay) {
    closeQuickView(activeOverlay);
  }

  const name = card.querySelector('h3').textContent;
  const price = card.querySelector('.price').textContent;
  const img = card.querySelector('img').src;

  const overlay = document.createElement('div');
  overlay.className = 'quickview-overlay';
  overlay.innerHTML =
    '<div class="quickview-modal">' +
    '  <button class="quickview-close" aria-label="Close">&times;</button>' +
    '  <img src="' + img + '" alt="' + name + '">' +
    '  <h3>' + name + '</h3>' +
    '  <p class="price">' + price + '</p>' +
    '</div>';

  document.body.appendChild(overlay);
  activeOverlay = overlay;

  overlay.querySelector('.quickview-close').addEventListener('click', function () {
    closeQuickView(overlay);
  });
}

document.addEventListener('click', function (e) {
  if (activeOverlay && e.target === activeOverlay) {
    closeQuickView(activeOverlay);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.product-card').forEach(function (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      openQuickView(card);
    });
  });
});
