import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Providers } from "./providers/ReactQueryProvider.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
