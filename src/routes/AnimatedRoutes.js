import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "../components/LandingPage/LandingPage";
import SignIn from "../components/SignInUpPage/SignIn";
import SignUp from "../components/SignInUpPage/SignUp";
import Dashboard from "../components/CalendarPage/Dashboard";
import { TrackingPage } from "../components/TrackingPage/TrackingPage";
import ProgressCharts from "../components/ProgressChartsPage/ProgressCharts";
import ExerciseLibraryHome from "../components/ExerciseLibraryPage/ExerciseLibraryHome";
import { AnimatePresence } from "framer-motion";
import ExerciseInformation from "../components/ExerciseLibraryPage/ExerciseInformation";

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
        <Route path="/graphs" element={<ProgressCharts />} />
        <Route path="/exerciselibrary" element={<ExerciseLibraryHome />} />
        <Route path="/exercise/:id" element={<ExerciseInformation />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
