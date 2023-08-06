import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "../Layout/ResponsiveAppBar";
import Box from "@mui/material/Box";
import Notes from "./Notes";
import { motion } from "framer-motion";
import WorkoutCard from "./WorkoutCard";
import ExerciseInputField from "./ExerciseInputField";
import WorkoutTitle from "./WorkoutTitle";
import EditSetModal from "./EditSetModal";

export function TrackingPage() {
  const { date } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editSetId, setEditSetId] = useState("");
  const [tempReps, setTempReps] = useState("");
  const [tempWeight, setTempWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const repsInputRef = useRef(null);

  const pathname = window.location.pathname;
  const workoutTitle = decodeURIComponent(
    pathname.split("/").slice(3).join("/")
  );

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

        // Calculate the set number (omitted from rendering atm because bugs out sometimes)
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
          notes: notes,
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
            notes: notes, // Add notes field
          },
        ]);

        setReps("");
        setWeight("");
        setNotes(""); // Clear the notes field
        repsInputRef.current.focus();
      }
    } catch (error) {
      console.error("Error adding workout: ", error);
    }
  };

  //Refetching the workout data from firebase so that the order of the sets rendered is not altered upon deleting a set
  const deleteWorkout = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const workoutDocRef = doc(db, "users", user.uid, "workouts", id);
        await deleteDoc(workoutDocRef);
        fetchWorkouts(); // Fetch the updated workouts after deleting
      }
    } catch (error) {
      console.error("Error deleting workout: ", error);
    }
  };

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

  useEffect(() => {
    fetchWorkouts();
  }, [date]);

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
            marginTop: "15rem",
          }}
        >
          <h3>Add a set to start tracking</h3>
        </div>
      );
    }

    const groupedWorkouts = groupWorkoutsByExercise();

    const handleCloseDrawer = () => {
      setOpenDrawer(false);
    };

    return (
      <Box>
        <Notes date={date} />
        {groupedWorkouts.map((group, index) => (
          <WorkoutCard
            key={index}
            group={group}
            editSetId={editSetId}
            tempReps={tempReps}
            tempWeight={tempWeight}
            deleteWorkout={deleteWorkout}
            handleEditClick={handleEditClick}
            openDrawer={openDrawer}
            handleCloseDrawer={handleCloseDrawer}
            setTempReps={setTempReps}
            setTempWeight={setTempWeight}
          />
        ))}
      </Box>
    );
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
    const validateAndSaveEdit = async () => {
      // Validate the inputs
      if (tempReps >= 0 && tempWeight >= 0) {
        try {
          // Save the edit
          const user = auth.currentUser;
          if (user) {
            const workoutDocRef = doc(
              db,
              "users",
              user.uid,
              "workouts",
              editSetId
            );
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
      }
    };

    // Validate and save the edit
    validateAndSaveEdit();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addWorkout();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: "0%" }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <ResponsiveAppBar />
      <ExerciseInputField
        exercise={exercise}
        setExercise={setExercise}
        reps={reps}
        setReps={setReps}
        weight={weight}
        setWeight={setWeight}
        addWorkout={addWorkout}
        handleKeyPress={handleKeyPress}
        repsInputRef={repsInputRef}
      />
      <WorkoutTitle workoutTitle={workoutTitle} />
      <div>{renderWorkouts()}</div>
      <EditSetModal
        openModal={openModal}
        handleCancelEdit={handleCancelEdit}
        handleSaveEdit={handleSaveEdit}
        tempReps={tempReps}
        setTempReps={setTempReps}
        tempWeight={tempWeight}
        setTempWeight={setTempWeight}
      />
    </motion.div>
  );
}
