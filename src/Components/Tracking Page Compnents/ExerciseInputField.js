import React from "react";
import { TextField } from "@mui/material";
import ExerciseName from "./ExerciseName";

const ExerciseInputField = ({
  exercise,
  setExercise,
  reps,
  setReps,
  weight,
  setWeight,
  addWorkout,
  handleKeyPress,
  repsInputRef,
}) => {
  return (
    <div className="exerciseInputFieldContainer">
      <ExerciseName
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />
      <TextField
        sx={{ width: 125 }}
        id="reps"
        label="Reps"
        variant="outlined"
        ref={repsInputRef}
        type="number"
        value={reps}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (value >= 0 || isNaN(value)) {
            setReps(e.target.value);
          }
        }}
        onKeyDown={handleKeyPress}
      />
      <TextField
        sx={{ width: 125 }}
        id="weight"
        label="Weight(lbs)"
        variant="outlined"
        type="number"
        value={weight}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (value >= 0 || isNaN(value)) {
            setWeight(e.target.value);
          }
        }}
        onKeyDown={handleKeyPress}
      />
      <button className="addSetButton" onClick={addWorkout}>
        Add Set
      </button>
    </div>
  );
};

export default ExerciseInputField;
