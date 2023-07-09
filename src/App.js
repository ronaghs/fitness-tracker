import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import Footer from "./Landing Page/Footer";
import AnimatedRoutes from "./Components/AnimatedRoutes";
function App() {
  return (
    <div className="appContainer">
      <Router>
        <AnimatedRoutes />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
