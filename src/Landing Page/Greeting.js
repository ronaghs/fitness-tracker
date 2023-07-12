import React from "react";
import { motion } from "framer-motion";
import "../styles.css";
import Typography from "@mui/material/Typography";
import CallToAction from "./CallToAction";

function Greeting() {
  const greetingVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 2,
      },
    },
  };

  const trackVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 2,
        delay: 1.5,
      },
    },
  };

  return (
    <div className="greetingContainer">
      <div className="greeting">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={greetingVariants}
        >
          <Typography fontSize={"5rem"}>
            <span>
              <b>Elevate</b>
            </span>{" "}
            your workouts,
          </Typography>
          <Typography variant="h2" gutterBottom>
            redefine{" "}
            <span>
              <b>excellence</b>
            </span>{" "}
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={trackVariants}>
          <Typography variant="h5" gutterBottom>
            Track. Progress. Elevate. Unleash your potential.
          </Typography>
        </motion.div>
        <CallToAction />
      </div>
    </div>
  );
}

export default Greeting;
