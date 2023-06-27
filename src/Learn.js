import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "./firebaseConfig";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "./Landing Page/ResponsiveAppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/system";

const ModalContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300px",
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}));

export function Learn() {
  const { date } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editSetId, setEditSetId] = useState("");
  const [tempReps, setTempReps] = useState("");
  const [tempWeight, setTempWeight] = useState("");

  const repsInputRef = useRef(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const workoutsCollectionRef = collection(
            db,
            "users",
            user.uid,
            "workouts"
          );
          const q = query(
            workoutsCollectionRef,
            where("date", "==", date),
            where("uid", "==", user.uid),
            orderBy("exercise") // Sort workouts by exercise name
          );
          const snapshot = await getDocs(q);
          const workoutData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWorkouts(workoutData);
        }
      } catch (error) {
        console.error("Error fetching workouts: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchWorkouts();
      } else {
        setWorkouts([]);
      }
    });
  }, [date]);

  const addWorkout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const workoutsCollectionRef = collection(
          db,
          "users",
          user.uid,
          "workouts"
        );

        // Get all workouts for the same exercise
        const q = query(
          workoutsCollectionRef,
          where("date", "==", date),
          where("uid", "==", user.uid),
          where("exercise", "==", exercise)
        );
        const snapshot = await getDocs(q);
        const workoutData = snapshot.docs.map((doc) => doc.data());

        // Calculate the set number
        const setNumber = workoutData.length > 0 ? workoutData.length + 1 : 1;

        // Add the workout with the set number
        const newWorkoutRef = await addDoc(workoutsCollectionRef, {
          exercise,
          reps,
          weight,
          set: setNumber, // Add the set number field
          date,
          uid: user.uid,
        });

        setWorkouts((prevWorkouts) => [
          ...prevWorkouts,
          {
            id: newWorkoutRef.id,
            exercise,
            reps,
            weight,
            set: setNumber,
            date,
            uid: user.uid,
          },
        ]);

        setReps("");
        setWeight("");
        repsInputRef.current.focus();
      }
    } catch (error) {
      console.error("Error adding workout: ", error);
    }
  };

  const deleteWorkout = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const workoutDocRef = doc(db, "users", user.uid, "workouts", id);
        await deleteDoc(workoutDocRef);

        // Filter out the deleted workout
        setWorkouts((prevWorkouts) =>
          prevWorkouts.filter((workout) => workout.id !== id)
        );

        // Renumber the sets for the remaining workouts of the same exercise
        const remainingWorkouts = workouts.filter(
          (workout) => workout.id !== id && workout.exercise === exercise
        );
        const updatedWorkouts = remainingWorkouts.map((workout, index) => ({
          ...workout,
          set: index + 1,
        }));
        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((workout) =>
            workout.exercise === exercise
              ? updatedWorkouts.find((w) => w.id === workout.id)
              : workout
          )
        );
      }
    } catch (error) {
      console.error("Error deleting workout: ", error);
    }
  };

  const groupWorkoutsByExercise = () => {
    const groupedWorkouts = [];
    let currentExercise = null;
    let currentGroup = null;

    workouts.forEach((workout) => {
      if (workout.exercise !== currentExercise) {
        currentExercise = workout.exercise;
        currentGroup = { exercise: currentExercise, sets: [] };
        groupedWorkouts.push(currentGroup);
      }
      currentGroup.sets.push(workout);
    });

    return groupedWorkouts;
  };

  const VerticalDivider = styled("div")({
    width: "1px",
    backgroundColor: "#ccc",
    height: "100%",
    marginLeft: "8px",
    marginRight: "8px",
  });

  const renderWorkouts = () => {
    const groupedWorkouts = groupWorkoutsByExercise();

    return groupedWorkouts.map((group, index) => (
      <Card key={index} className="exerciseCard">
        <CardContent>
          <Typography
            variant="h6"
            component="h2"
            className="exerciseName"
            style={{ fontSize: "1.75rem", fontWeight: "bold" }}
          >
            {group.exercise}
          </Typography>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {group.sets
              .sort((a, b) => a.set - b.set) // Sort workouts by set numbers in ascending order
              .map((set, setIndex) => (
                <div key={setIndex} className="workoutSet">
                  <Typography variant="body1" component="p" className="setData">
                    <span className="setLabel">Set:</span> {set.set}
                  </Typography>
                  <Typography variant="body1" component="p" className="setData">
                    <span className="setLabel">Reps:</span>{" "}
                    {editSetId === set.id ? tempReps : set.reps}
                  </Typography>
                  <Typography variant="body1" component="p" className="setData">
                    <span className="setLabel">Weight:</span>{" "}
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
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    ));
  };

  const handleEditClick = (set) => {
    setEditSetId(set.id);
    setTempReps(set.reps);
    setTempWeight(set.weight);
    setOpenModal(true);
  };

  const handleCancelEdit = () => {
    setEditSetId("");
    setTempReps("");
    setTempWeight("");
    setOpenModal(false);
  };

  const handleSaveEdit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const workoutDocRef = doc(db, "users", user.uid, "workouts", editSetId);
        await updateDoc(workoutDocRef, {
          reps: tempReps,
          weight: tempWeight,
        });
        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((workout) =>
            workout.id === editSetId
              ? { ...workout, reps: tempReps, weight: tempWeight }
              : workout
          )
        );
        setEditSetId("");
        setTempReps("");
        setTempWeight("");
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error updating workout: ", error);
    }
  };

  return (
    <div>
      <ResponsiveAppBar />
      <div className="exerciseInputFieldContainer">
        <input
          type="text"
          placeholder="Exercise"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        />
        <input
          ref={repsInputRef}
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button className="addSetButton" onClick={addWorkout}>
          Add Set
        </button>
      </div>
      <div>{renderWorkouts()}</div>
      <Modal open={openModal} onClose={handleCancelEdit}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Set
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <label>
              Reps
              <input
                className="editModalInput"
                type="number"
                value={tempReps}
                onChange={(e) => setTempReps(e.target.value)}
              />
            </label>
            <label>
              Weight
              <input
                className="editModalInput"
                type="number"
                value={tempWeight}
                onChange={(e) => setTempWeight(e.target.value)}
              />
            </label>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex", gap: 2, mt: 2 }}>
            <Button onClick={handleSaveEdit} variant="contained">
              Save
            </Button>
            <Button onClick={handleCancelEdit} variant="outlined">
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
