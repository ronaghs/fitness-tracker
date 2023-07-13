import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExerciseHistory from "./ExerciseHistory";

const WorkoutCard = ({
  group,
  editSetId,
  tempReps,
  tempWeight,
  deleteWorkout,
  handleEditClick,
  openDrawer,
  handleCloseDrawer,
  setTempReps,
  setTempWeight,
}) => {
  return (
    <Card className="exerciseCard">
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          className="exerciseName"
          style={{
            fontSize: "1.75rem",
            fontWeight: "bold",
          }}
          sx={{ color: "#0372f0" }}
        >
          {group.exercise}
        </Typography>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {group.sets
            .sort((a, b) => a.set - b.set)
            .map((set, setIndex) => (
              <motion.div
                key={setIndex}
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: setIndex * 0.1 }}
                className="workoutSet"
              >
                <Typography variant="body1" component="p" className="setData">
                  <span className="setLabel">Repetitions:</span>{" "}
                  {editSetId === set.id ? tempReps : set.reps}
                </Typography>
                <Typography variant="body1" component="p" className="setData">
                  <span className="setLabel">Weight(lbs):</span>{" "}
                  {editSetId === set.id ? tempWeight : set.weight}
                </Typography>
                <Tooltip title="Delete Set">
                  <IconButton
                    onClick={() => deleteWorkout(set.id)}
                    aria-label="delete"
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Set">
                  <IconButton
                    onClick={() => handleEditClick(set)}
                    aria-label="edit"
                    sx={{ color: "green" }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </motion.div>
            ))}
        </div>
      </CardContent>
      <ExerciseHistory
        selectedExercise={group.exercise}
        openDrawer={openDrawer}
        handleCloseDrawer={handleCloseDrawer}
      />
    </Card>
  );
};

export default WorkoutCard;
