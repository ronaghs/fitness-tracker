import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignIn/SignUp";
import Dashboard from "./Dashboard";
import { Learn } from "./Learn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn/:date/*" element={<Learn />} />
      </Routes>
    </Router>
  );
}

export default App;
