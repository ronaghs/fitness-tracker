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

export function Learn() {
  const { date } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

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
        const newWorkoutRef = await addDoc(workoutsCollectionRef, {
          exercise,
          reps,
          weight,
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
        setWorkouts((prevWorkouts) =>
          prevWorkouts.filter((workout) => workout.id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting workout: ", error);
    }
  };

  return (
    <div>
      <ResponsiveAppBar />
      <div>
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
        <button onClick={addWorkout}>Add Set</button>
      </div>
      <div>
        {workouts.map((workout, index) => (
          <div key={workout.id}>
            {index === 0 ||
            workout.exercise !== workouts[index - 1].exercise ? (
              <h3>Exercise: {workout.exercise}</h3>
            ) : null}
            <p>Reps: {workout.reps}</p>
            <p>Weight: {workout.weight}</p>
            <button onClick={() => deleteWorkout(workout.id)}>
              Delete Set
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
