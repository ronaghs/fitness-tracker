import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AnimatedRoutes from "./routes/AnimatedRoutes";

function App() {
  return (
    <div className="appContainer">
      <Router>
        <AnimatedRoutes />
      </Router>
    </div>
  );
}

export default App;
