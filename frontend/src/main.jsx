import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import PersistedReduxStore from "./components/PersistedReduxStore.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PersistedReduxStore>
      <Router>
        <App />
      </Router>
    </PersistedReduxStore>
  </StrictMode>
);