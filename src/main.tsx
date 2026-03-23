import { createRoot } from "react-dom/client";
import App from "./app/App";
import AppProviders from "./app/providers/AppProviders";
import "./styles/index.scss";

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
