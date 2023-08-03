import React, { useState, useEffect, useRef } from "react";
import Pagination from "@mui/material/Pagination";
import { Box, Stack, Typography } from "@mui/material";
import { exerciseOptions, fetchData } from "../utils/fetchData";
import ExerciseCard from "./ExerciseCard";

function Exercises({ setExercises, bodyPart, exercises }) {
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 12;
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  // Create a ref for the "Exercises" section
  const exercisesRef = useRef();

  const paginate = (e, value) => {
    setCurrentPage(value);

    // Scroll to the top of the "Exercises" section
    window.scrollTo({
      top: exercisesRef.current.offsetTop,
      behavior: "smooth",
      duration: 500,
    });
  };

  useEffect(() => {
    const fetchExerciseData = async () => {
      let exerciseData = [];

      if (bodyPart === "all") {
        exerciseData = await fetchData(
          "https://exercisedb.p.rapidapi.com/exercises/",
          exerciseOptions
        );
      } else {
        exerciseData = await fetchData(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
          exerciseOptions
        );
      }
      setExercises(exerciseData);
    };

    fetchExerciseData();
  }, [bodyPart]);

  return (
    <Box
      ref={exercisesRef} // Attach the ref to the "Exercises" section
      id={exercises}
      sx={{ mt: { lg: "9rem" } }}
      mt="3rem"
      p="1.5rem"
    >
      <Typography variant="h4" mb="3rem">
        Results:
      </Typography>
      <Stack
        direction="row"
        sx={{ gap: { lg: "7rem", xs: "3rem" } }}
        flexWrap="wrap"
        justifyContent="center"
      >
        {currentExercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}
      </Stack>
      <Stack mt="7rem" alignItems="center">
        {exercises.length > 9 && (
          <Pagination
            color="standard"
            shape="rounded"
            defaultPage={1}
            count={Math.ceil(exercises.length / exercisesPerPage)}
            page={currentPage}
            onChange={paginate}
            size="large"
          />
        )}
      </Stack>
    </Box>
  );
}

export default Exercises;
