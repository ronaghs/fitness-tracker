import React, { useState } from "react";
import ExerciseLibrary from "./ExerciseLibrary";
import ResponsiveAppBar from "../Layout/ResponsiveAppBar";
import Exercises from "./Exercises";
import { motion } from "framer-motion";

function ExerciseLibrayHome() {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState("all");

  return (
    <motion.div
      initial={false} // Initial state...no Y so page does not scroll down on refresh
      animate={{ opacity: 1, y: "0%" }} // Animation state
      exit={{ opacity: 0, y: "-100%" }} // Exit state
      transition={{ duration: 0.75, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <ResponsiveAppBar />
      <ExerciseLibrary
        setExercises={setExercises}
        bodyPart={bodyPart}
        setBodyPart={setBodyPart}
      />
      <Exercises
        setExercises={setExercises}
        bodyPart={bodyPart}
        exercises={exercises}
      />
    </motion.div>
  );
}

export default ExerciseLibrayHome;
