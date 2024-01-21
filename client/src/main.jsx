import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "remixicon/fonts/remixicon.css";
import { WebProvider } from "./context/WebContext.jsx";
import { SourceTokenMinterProvider } from "./context/SourceTokenMinterContext.jsx";
import { DestMarketplaceProvider } from "./context/DestMarketplaceContext.jsx";
import { SourceBridgeProvider } from "./context/SourceBridgeContext.jsx";
import { DestBridgeProvider } from "./context/DestBridgeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WebProvider>
      <DestMarketplaceProvider>
        <SourceBridgeProvider>
          <DestBridgeProvider>
            <SourceTokenMinterProvider>
              <Router>
                <App />
              </Router>
            </SourceTokenMinterProvider>
          </DestBridgeProvider>
        </SourceBridgeProvider>
      </DestMarketplaceProvider>
    </WebProvider>
  </React.StrictMode>
);
