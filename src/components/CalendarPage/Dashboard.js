import React from "react";
import Calendar from "./Calendar";
import Navbar from "../Layout/ResponsiveAppBar";
import { motion } from "framer-motion";

function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }} // Initial state
      animate={{ opacity: 1, y: "0%" }} // Animation state
      exit={{ opacity: 0, y: "-100%" }} // Exit state
      transition={{ duration: 0.75, ease: [0.43, 0.13, 0.23, 0.96] }} // Animation transition
    >
      <Navbar />
      <Calendar />
    </motion.div>
  );
}

export default Dashboard;
