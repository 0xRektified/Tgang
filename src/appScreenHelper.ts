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

const initializeApp = () => {
  // App in full screen mode
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

  let ts: number | undefined;
  const onTouchStart = (e: TouchEvent) => {
    ts = e.touches[0].clientY;
  };

  const handlePositionCheck = () => {
    const scrollableEl = document.getElementById("mainView");
    const bufferEl = document.getElementById("buffer");

    if (scrollableEl && bufferEl) {
      const bufferRect = bufferEl.getBoundingClientRect();
      if (bufferRect.bottom > 0) {
        scrollableEl.scrollIntoView();
      }
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    handlePositionCheck();
  };

  const onTouchEnd = (e: TouchEvent) => {
    handlePositionCheck();
  };

  const debouncedCheckPosition = debounce(handlePositionCheck, 100, true);

  const handleScroll = () => {
    handlePositionCheck();
  };

  document.documentElement.addEventListener("touchstart", onTouchStart, {
    passive: false,
  });
  document.documentElement.addEventListener("touchmove", onTouchMove, {
    passive: false,
  });
  document.documentElement.addEventListener("touchend", onTouchEnd, {
    passive: false,
  });
  document.addEventListener("scroll", handleScroll, {
    passive: true,
  });
  document.addEventListener("scroll", debouncedCheckPosition, {
    passive: true,
  });
};

export { initializeApp };
