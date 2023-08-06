import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

const ExerciseHistory = ({
  selectedExercise,
  openDrawer,
  handleCloseDrawerProp,
}) => {
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchExerciseHistory = async () => {
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
            where("exercise", "==", selectedExercise),
            where("uid", "==", user.uid),
            orderBy("date", "desc")
          );
          const snapshot = await getDocs(q);
          const exerciseData = snapshot.docs.map((doc) => doc.data());
          setExerciseHistory(exerciseData);
        }
      } catch (error) {
        console.error("Error fetching exercise history: ", error);
      }
    };

    if (selectedExercise) {
      fetchExerciseHistory();
    }
  }, [selectedExercise]);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpenDrawer}>View History</Button>
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleCloseDrawer}>
        <div>
          <Typography fontWeight="bold" variant="h4" gutterBottom>
            {selectedExercise} History
          </Typography>
          {exerciseHistory.length > 0 ? (
            (() => {
              const groupedData = {};

              exerciseHistory.forEach((exerciseData) => {
                const date = exerciseData.date;
                const set = {
                  reps: exerciseData.reps,
                  weight: exerciseData.weight,
                  set: exerciseData.set, // Include the set number for sorting
                };

                if (!groupedData[date]) {
                  groupedData[date] = [set];
                } else {
                  groupedData[date].push(set);
                }
              });

              return Object.entries(groupedData).map(([date, sets], index) => (
                <Box padding={1.5} key={index}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{
                      fontSize: "1.2rem",
                      color: "#0372f0",
                      fontWeight: "bold",
                    }}
                  >
                    <Box marginTop={0.25}>Date: {date}</Box>
                  </Typography>
                  <Divider variant="left" />{" "}
                  {sets
                    .sort((a, b) => a.set - b.set) // Sort sets by set number
                    .map((set, setIndex) => (
                      <div key={setIndex}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: "#0372f0",
                            fontWeight: "bold",
                            marginTop: "1rem",
                          }}
                        >
                          Set {setIndex + 1}:
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: "#333",
                          }}
                        >
                          <Box display="inline">Reps:</Box> {set.reps}
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: "#333",
                          }}
                        >
                          <Box display="inline">Weight(lbs): {set.weight}</Box>
                        </Typography>
                      </div>
                    ))}
                </Box>
              ));
            })()
          ) : (
            <Typography variant="subtitle1" gutterBottom>
              Select an exercise to view history
            </Typography>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default ExerciseHistory;
