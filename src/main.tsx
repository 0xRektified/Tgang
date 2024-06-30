import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import WebApp from "@twa-dev/sdk";

// App in full screenmode
WebApp.ready();
WebApp.expand();
WebApp.isClosingConfirmationEnabled = true;

let ts: number | undefined;
const onTouchStart = (e: TouchEvent) => {
  ts = e.touches[0].clientY;
};
const onTouchMove = (e: TouchEvent) => {
  const scrollableEl = document.documentElement.querySelector("body");

  console.log(scrollableEl);
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
