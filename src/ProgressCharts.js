// ExercisePage.js
import React, { useState } from "react";
import ExerciseName from "./ExerciseName";
import WeightChart from "./Charts/WeightChart";
import VolumeChart from "./Charts/VolumeChart";
import { motion } from "framer-motion";

const ExercisePage = () => {
  const [selectedExercise, setSelectedExercise] = useState("");

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }} // Initial state
      animate={{ opacity: 1, y: "0%" }} // Animation state
      exit={{ opacity: 0, y: "-100%" }} // Exit state
      transition={{ duration: 0.75, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <WeightChart selectedExercise={selectedExercise} />
      {/* <VolumeChart /> */}
    </motion.div>
  );
};

export default ExercisePage;
