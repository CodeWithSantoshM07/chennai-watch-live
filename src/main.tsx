// @ts-nocheck
// Vercel/Vite SPA entry point.
// NOTE: This file is NOT used by the Lovable preview (which runs TanStack Start
// via @lovable.dev/vite-tanstack-config + src/server.ts). It only takes effect
// after you complete the conversion steps in DEPLOY_VERCEL.md locally:
//   1. Swap vite.config.ts to a plain Vite + React config
//   2. Delete src/server.ts, src/start.ts, src/router.tsx, src/routeTree.gen.ts
//   3. Convert src/routes/*.tsx from createFileRoute(...) to default exports
//   4. Install react-router-dom
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

// After conversion, import your page components like:
// import Index from "./routes/index";
// import Login from "./routes/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Replace these placeholders with your converted route components */}
        <Route path="/" element={<div />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);