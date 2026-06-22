import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GameSettingsProvider } from "./contexts/GameSettingsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameSettingsProvider>
      <App />
    </GameSettingsProvider>
  </StrictMode>,
);
