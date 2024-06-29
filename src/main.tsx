import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import WebApp from "@twa-dev/sdk";

// App in full screenmode
WebApp.ready();
WebApp.expand();

// Avoid close on scrolling down
const overflow = 100;
document.body.style.overflowY = "hidden";
document.body.style.marginTop = `${overflow}px`;
document.body.style.height = window.innerHeight + overflow + "px";
document.body.style.paddingBottom = `${overflow}px`;
window.scrollTo(0, overflow);

let ts: number | undefined;
const onTouchStart = (e: TouchEvent) => {
  ts = e.touches[0].clientY;
};
const scrollableEl = document.querySelector(".scrollable");
const onTouchMove = (e: TouchEvent) => {
  if (scrollableEl) {
    const scroll = scrollableEl.scrollTop;
    const te = e.changedTouches[0].clientY;
    if (scroll <= 0 && ts! < te) {
      e.preventDefault();
    }
  } else {
    e.preventDefault();
  }
};
document.documentElement.addEventListener("touchstart", onTouchStart, {
  passive: false,
});
document.documentElement.addEventListener("touchmove", onTouchMove, {
  passive: false,
});

// this manifest is used temporarily for development purposes
const manifestUrl =
  "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </TonConnectUIProvider>
);
