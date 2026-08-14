import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Docs } from "./routes/Docs";
import { Landing } from "./routes/Landing";
import { Legal } from "./routes/Legal";
import { VaultApp } from "./routes/VaultApp";
import { ChainSnapshot, readChain } from "./lib/chain";
import { ToastHost } from "./lib/toast";
import "./index.css";

/**
 * Chain state is read once at the root and shared by both routes, so switching
 * between the landing page and the app doesn't re-fetch or flash.
 */
function Root() {
  const [chain, setChain] = useState<ChainSnapshot | null>(null);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    const tick = () =>
      readChain()
        .then((snapshot) => !cancelled && setChain(snapshot))
        .catch(() => {
          /* keep the last good snapshot rather than blanking the UI */
        });

    tick();
    const id = setInterval(tick, 6_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [nonce]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing chain={chain} />} />
        <Route path="/app" element={<VaultApp chain={chain} refresh={refresh} />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/docs/:slug" element={<Docs />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="*" element={<Landing chain={chain} />} />
      </Routes>
      <ToastHost />
    </>
  );
}

/** Route changes should start at the top, not wherever the last page was scrolled. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
);
