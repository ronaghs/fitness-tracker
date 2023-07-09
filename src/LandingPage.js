// LandingPage.js
import React from "react";
import ResponsiveAppBar from "./Landing Page/ResponsiveAppBar";
import Greeting from "./Landing Page/Greeting";
import InfoStack from "./Landing Page/InfoStack";
import InvertedInfoStack from "./Landing Page/InvertedInfoStack";
import "./styles.css";
import Divider from "./Landing Page/Divider";
import calendar from "./Images/calendar.png";
import log from "./Images/log.png";
import graph from "./Images/graph.png";
import Footer from "./Landing Page/Footer";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state...no Y so page does not scroll down on refresh
      animate={{ opacity: 1, y: "0%" }} // Animation state
      exit={{ opacity: 0, y: "-100%" }} // Exit state
      transition={{ duration: 0.75, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <Box>
        <ResponsiveAppBar />
        <Greeting />
        <Divider />
        <InfoStack
          imageSrc={calendar}
          altText="Showing the calendar functionality of the site. Allowing you to plan workouts ahead and stay on track with your fitness goals."
          title="Think Ahead"
          subtitle1="Plan and organize workouts,"
          subtitle2="stay on track."
        />
        <InvertedInfoStack
          imageSrc={log}
          altText="Showing the calendar functionality of the site. Allowing you to plan workouts ahead and stay on track with your fitness goals."
          title="Track Workouts"
          subtitle1="Detailed record of your training sessions"
          subtitle2="to help hit your goals."
        />
        <InfoStack
          imageSrc={graph}
          altText="Showing the calendar functionality of the site. Allowing you to plan workouts ahead and stay on track with your fitness goals."
          title="View Progress"
          subtitle1="Push your limits and"
          subtitle2="observe your progress "
        />
      </Box>
    </motion.div>
  );
}

export default LandingPage;
