import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Footer from "./components/Layout/Footer";
import AnimatedRoutes from "./routes/AnimatedRoutes";

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
