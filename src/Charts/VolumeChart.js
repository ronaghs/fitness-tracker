import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import ExerciseName from "../ExerciseName";
import ExerciseHistory from "../ExerciseHistory";

const VolumeChart = () => {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Weight(lbs)",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Weight Progress",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [],
      },
    },
  });

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        let exerciseData = [];

        if (selectedExercise) {
          exerciseData = await fetchExerciseDataFromFirestore(selectedExercise);
        }

        console.log("Exercise Data:", exerciseData);

        const sortedData = exerciseData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }
          return a.set - b.set;
        });

        console.log("Sorted Data:", sortedData);

        const weights = sortedData.map((data) => data.weight);
        const dates = sortedData.map((data) => data.date);

        console.log("Weights:", weights);
        console.log("Dates:", dates);

        setChartData((prevChartData) => ({
          ...prevChartData,
          series: [
            {
              ...prevChartData.series[0],
              data: weights,
            },
          ],
          options: {
            ...prevChartData.options,
            xaxis: {
              categories: dates,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching exercise data: ", error);
      }
    };

    fetchExerciseData();
  }, [selectedExercise]);

  const fetchExerciseDataFromFirestore = async (exercise) => {
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
        where("exercise", "==", exercise),
        where("uid", "==", user.uid),
        orderBy("timestamp", "asc")
      );
      const snapshot = await getDocs(q);
      const exerciseData = snapshot.docs.map((doc) => doc.data());
      return exerciseData;
    }
    return [];
  };

  return (
    <div>
      <ExerciseName
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
      />
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      </div>
      <ExerciseHistory selectedExercise={selectedExercise} />
    </div>
  );
};

export default VolumeChart;
