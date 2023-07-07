import React, { useState } from "react";
import ExerciseName from "./ExerciseName";
import WeightChart from "./Charts/WeightChart";
import VolumeChart from "./Charts/VolumeChart";

const ExercisePage = () => {
  const [selectedExercise, setSelectedExercise] = useState("");

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  return (
    <div>
      <WeightChart selectedExercise={selectedExercise} />
      {/* <VolumeChart /> */}
    </div>
  );
};

export default ExercisePage;
