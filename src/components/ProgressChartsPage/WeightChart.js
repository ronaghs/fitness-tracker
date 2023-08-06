import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import ExerciseName from "../TrackingPage/ExerciseName";
import ExerciseHistory from "../TrackingPage/ExerciseHistory";
import ResponsiveAppBar from "../Layout/ResponsiveAppBar";
import { Box, Typography } from "@mui/material";

const ApexChart = () => {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [chartData, setChartData] = useState({
    weightSeries: [
      {
        name: "Weight(lbs)",
        data: [],
      },
    ],
    volumeSeries: [
      {
        name: "Volume",
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
        toolbar: {
          show: false, // Hide the chart toolbar
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "straight",
        width: 2, // Increase the stroke width for better visibility
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.7,
        },
      },
      xaxis: {
        categories: [],
        labels: {
          show: true,
          rotate: -45, // Rotate the x-axis labels for better readability
          style: {
            fontSize: "0.75rem", // Adjust the font size of the x-axis labels
            fontFamily: "Arial, sans-serif", // Set a specific font family for the x-axis labels
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "0.75rem", // Adjust the font size of the y-axis labels
            fontFamily: "Arial, sans-serif", // Set a specific font family for the y-axis labels
          },
        },
      },
      colors: ["#ff0000"], // Color for weight progress chart
    },
  });

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        let exerciseData = [];

        if (selectedExercise) {
          exerciseData = await fetchExerciseDataFromFirestore(selectedExercise);
        }

        const dailyVolumes = {};
        const dailyWeights = {};

        exerciseData.forEach((data) => {
          const date = data.date;
          const volume = data.weight * data.reps;
          const weight = data.weight;
          if (dailyVolumes[date]) {
            dailyVolumes[date] += volume;
            dailyWeights[date] = Math.max(dailyWeights[date], weight);
          } else {
            dailyVolumes[date] = volume;
            dailyWeights[date] = weight;
          }
        });

        const dates = Object.keys(dailyVolumes).reverse();
        const volumes = dates.map((date) => dailyVolumes[date]);
        const weights = dates.map((date) => dailyWeights[date]);

        setChartData((prevChartData) => ({
          ...prevChartData,
          weightSeries: [
            {
              ...prevChartData.weightSeries[0],
              data: weights,
            },
          ],
          volumeSeries: [
            {
              ...prevChartData.volumeSeries[0],
              data: volumes,
            },
          ],
          options: {
            ...prevChartData.options,
            xaxis: {
              categories: dates,
            },
            colors: ["#098be8"], // Color for volume progress chart
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
        orderBy("date", "desc")
      );
      const snapshot = await getDocs(q);
      const exerciseData = snapshot.docs.map((doc) => doc.data());
      return exerciseData;
    }
    return [];
  };

  return (
    <div>
      <ResponsiveAppBar />
      <Typography
        mt={3}
        align="center"
        variant="h4"
        fontWeight="bold"
        sx={{ color: "#0372f0" }}
      >
        Progress Tracker
      </Typography>
      <Box mt={2} align="center">
        <ExerciseName
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        />
        <ExerciseHistory selectedExercise={selectedExercise} />
      </Box>

      <div id="weight-chart">
        <h2 style={{ color: "#098be8" }}>Max Weight</h2>
        <ReactApexChart
          options={chartData.options}
          series={chartData.weightSeries}
          type="line"
          height={300}
        />
      </div>
      <div id="volume-chart">
        <h2 style={{ color: "#12a19e" }}>Total Volume(lbs)</h2>
        <ReactApexChart
          options={{
            ...chartData.options,
            xaxis: {
              ...chartData.options.xaxis,
              categories:
                chartData.weightSeries[0].data.length > 0
                  ? chartData.options.xaxis.categories
                  : [],
            },
            colors: ["#12a19e"], // Different color for volume progress chart
          }}
          series={chartData.volumeSeries}
          type="line"
          height={300}
        />
      </div>
    </div>
  );
};

export default ApexChart;
