import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignIn/SignUp";
import Dashboard from "./Dashboard";
import { Learn } from "./Learn";
import Notes from "./Notes";
import ProgressCharts from "./ProgressCharts";
import Footer from "./Landing Page/Footer";
function App() {
  return (
    <div className="appContainer">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn/:date/*" element={<Learn />} />
          <Route path="/notes*" element={<Notes />} />
          <Route path="/graphs" element={<ProgressCharts />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
