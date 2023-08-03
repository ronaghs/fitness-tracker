import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "../LandingPage";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignIn/SignUp";
import Dashboard from "../Dashboard";
import { TrackingPage } from "../TrackingPage";
import Notes from "./Tracking Page Compnents/Notes";
import ProgressCharts from "../ProgressCharts";
import ExerciseLibraryHome from "../Charts/ExerciseLibraryHome";
import { AnimatePresence } from "framer-motion";
import ExerciseInformation from "../Charts/ExerciseInformation";

function AnimatedRoutes() {
  const location = useLocation();

  //To prevent scroll restoration. Mainly for when user clicks an exercise card from the exercise library.
  function useScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  }

  useScrollToTop();
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
        <Route path="/exerciselibrary" element={<ExerciseLibraryHome />} />
        <Route path="/exercise/:id" element={<ExerciseInformation />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
