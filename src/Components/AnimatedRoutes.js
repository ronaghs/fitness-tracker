import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "../LandingPage";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignIn/SignUp";
import Dashboard from "../Dashboard";
import { TrackingPage } from "../TrackingPage";
import Notes from "../Notes";
import ProgressCharts from "../ProgressCharts";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/log/:date/*" element={<TrackingPage />} />
        <Route path="/notes*" element={<Notes />} />
        <Route path="/graphs" element={<ProgressCharts />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
