import WebApp from "@twa-dev/sdk";

function setupDocument(enable: boolean) {
  if (enable) {
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('height');
    document.body.style.removeProperty('overflow');
  }
}

function preventBodyScroll(event: TouchEvent) {
  if ((event.target as Element).closest('.scrollable-content')) {
    return;
  }
  event.preventDefault();
}

export const initializeApp = () => {
  WebApp.ready();
  WebApp.expand();
  WebApp.isClosingConfirmationEnabled = true;

  setupDocument(true);
  document.body.addEventListener('touchmove', preventBodyScroll, { passive: false });

  WebApp.onEvent("viewportChanged", (params) => {
    if (!params.isStateStable) {
      WebApp.expand();
    }
  });

  // Initial scroll into view
  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      const scrollableEl = document.getElementById("mainView");
      if (scrollableEl) {
        scrollableEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
};

export const cleanupApp = () => {
  setupDocument(false);
  document.body.removeEventListener('touchmove', preventBodyScroll);
};