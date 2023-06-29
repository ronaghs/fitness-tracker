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
import TextBox from "./Notes";

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
  const { date, eventTitle } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editSetId, setEditSetId] = useState("");
  const [tempReps, setTempReps] = useState("");
  const [tempWeight, setTempWeight] = useState("");
  const repsInputRef = useRef(null);

  const pathname = window.location.pathname;
  const workoutTitle = decodeURIComponent(pathname.split("/")[3]);
  console.log(workoutTitle);

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
            where("uid", "==", user.uid)
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

    return () => unsubscribe();
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

        // Add the workout with the set number and timestamp
        const timestamp = new Date().getTime(); // Get current timestamp
        const newWorkoutRef = await addDoc(workoutsCollectionRef, {
          exercise,
          reps,
          weight,
          set: setNumber,
          date,
          uid: user.uid,
          timestamp, // Add timestamp field
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
            timestamp,
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

        setWorkouts((prevWorkouts) => {
          // Filter out the deleted workout
          const updatedWorkouts = prevWorkouts.filter(
            (workout) => workout.id !== id
          );

          // Renumber the sets for the remaining workouts of the same exercise
          const remainingWorkouts = updatedWorkouts.filter(
            (workout) => workout.exercise === exercise
          );
          const renumberedWorkouts = remainingWorkouts.map(
            (workout, index) => ({
              ...workout,
              set: index + 1,
            })
          );

          // Merge the updated and renumbered workouts
          return updatedWorkouts.map((workout) =>
            workout.exercise === exercise
              ? renumberedWorkouts.find((w) => w.id === workout.id)
              : workout
          );
        });
      }
    } catch (error) {
      console.error("Error deleting workout: ", error);
    }
  };

  const groupWorkoutsByExercise = () => {
    const groupedWorkouts = new Map();

    workouts.forEach((workout) => {
      const { exercise } = workout;

      if (groupedWorkouts.has(exercise)) {
        groupedWorkouts.get(exercise).push(workout);
      } else {
        groupedWorkouts.set(exercise, [workout]);
      }
    });

    // Sort workouts within each exercise group by timestamp in ascending order
    groupedWorkouts.forEach((sets) => {
      sets.sort((a, b) => a.timestamp - b.timestamp);
    });

    // Convert the Map to an array of objects
    const groupedWorkoutsArray = Array.from(
      groupedWorkouts,
      ([exercise, sets]) => ({
        exercise,
        sets,
      })
    );

    // Sort exercise groups based on the earliest workout timestamp within each group
    groupedWorkoutsArray.sort((a, b) => {
      const aEarliestTimestamp = a.sets[0]?.timestamp || Infinity;
      const bEarliestTimestamp = b.sets[0]?.timestamp || Infinity;
      return aEarliestTimestamp - bEarliestTimestamp;
    });

    return groupedWorkoutsArray;
  };

  const renderWorkouts = () => {
    if (workouts.length === 0) {
      return (
        <div
          style={{
            opacity: "0.9",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          <h3>Add a set to start tracking</h3>
        </div>
      );
    }

    const groupedWorkouts = groupWorkoutsByExercise();

    return groupedWorkouts.map((group, index) => (
      <Card key={index} className="exerciseCard">
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
              .sort((a, b) => a.set - b.set) // Sort workouts by set numbers in ascending order
              .map((set, setIndex) => (
                <div key={setIndex} className="workoutSet">
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
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 0 || isNaN(value)) {
              // Validate if the value is greater than or equal to 0 or NaN
              setReps(e.target.value);
            }
          }}
        />

        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 0 || isNaN(value)) {
              // Validate if the value is greater than or equal to 0 or NaN
              setWeight(e.target.value);
            }
          }}
        />
        <button className="addSetButton" onClick={addWorkout}>
          Add Set
        </button>
      </div>
      <h1 className="workoutTitle">{workoutTitle}</h1>
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
