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

function LandingPage() {
  return (
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
  );
}

export default LandingPage;
