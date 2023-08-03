import React, { useState } from "react";
import ExerciseLibrary from "./ExerciseLibrary";
import ResponsiveAppBar from "../Landing Page/ResponsiveAppBar";
import Exercises from "./Exercises";

function ExerciseLibrayHome() {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState("all");

  console.log(bodyPart);
  return (
    <div>
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
    </div>
  );
}

export default ExerciseLibrayHome;
