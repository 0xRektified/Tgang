import WebApp from "@twa-dev/sdk";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const later = () => {
      timeout = undefined;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

export const handlePositionCheck = () => {
  const scrollableEl = document.getElementById("mainView");
  const bufferEl = document.getElementById("buffer");

  if (scrollableEl && bufferEl) {
    const bufferRect = bufferEl.getBoundingClientRect();
    if (bufferRect.bottom > 0) {
      scrollableEl.scrollIntoView();
    }
  }
};

const initializeApp = () => {
  WebApp.ready();
  WebApp.expand();
  WebApp.isClosingConfirmationEnabled = true;
  let stable = false;

  WebApp.onEvent("viewportChanged", (params) => {
    stable = params.isStateStable;
    if (!stable) {
      WebApp.expand();
    }
  });

  const handleScroll = () => {
    handlePositionCheck();
  };

  window.addEventListener("resize", debounce(handlePositionCheck, 100));

  document.documentElement.addEventListener("touchstart", handlePositionCheck, {
    passive: false,
  });
  document.documentElement.addEventListener("touchmove", handlePositionCheck, {
    passive: false,
  });
  document.documentElement.addEventListener("touchend", handlePositionCheck, {
    passive: false,
  });
  document.addEventListener("scroll", handleScroll, {
    passive: true,
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

export { initializeApp };
