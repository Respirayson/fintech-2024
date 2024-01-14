import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "remixicon/fonts/remixicon.css";
import { WebProvider } from "./context/WebContext.jsx";
import { SourceTokenMinterProvider } from "./context/SourceTokenMinterContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WebProvider>
      <SourceTokenMinterProvider>
        <Router>
          <App />
        </Router>
      </SourceTokenMinterProvider>
    </WebProvider>
  </React.StrictMode>
);
