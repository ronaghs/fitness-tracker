import React from "react";
import ReactDOM from "react-dom/client";
// Keep this baseline in mind. Might be helpful in the future for some styling
// import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
