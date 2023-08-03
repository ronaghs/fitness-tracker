import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../Landing Page/ResponsiveAppBar";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { exerciseOptions, fetchData } from "../utils/fetchData";
import HorizontalScroll from "./HorizontalScroll";

function ExerciseLibrary({ setExercises, bodyPart, setBodyPart }) {
  const [search, setSearch] = useState("");
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchExerciseData = async () => {
      const bodyPartsData = await fetchData(
        "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
        exerciseOptions
      );

      setBodyParts(["all", ...bodyPartsData]);
    };
    fetchExerciseData();
  }, []);

  const handleSearch = async () => {
    if (search) {
      const exerciseData = await fetchData(
        "https://exercisedb.p.rapidapi.com/exercises/",
        exerciseOptions
      );

      const searchedExercises = exerciseData.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(search) ||
          exercise.target.toLowerCase().includes(search) ||
          exercise.equipment.toLowerCase().includes(search) ||
          exercise.bodyPart.toLowerCase().includes(search)
      );
      setSearch("");
      setExercises(searchedExercises);
      window.scrollTo({ top: 600, behavior: "smooth" });
    }
  };

  return (
    <div>
      <Stack alignItems="center" mt="1rem" justifyContent="center" p="1.5rem">
        <Typography
          fontWeight="700"
          sx={{
            fontSize: { lg: "2rem", xs: "1.5rem" },
            marginBottom: { lg: "2rem", xs: "1rem" },
          }}
          textAlign="center"
        >
          Explore Various Exercises <br />
          Learn. Improve. Excel.
        </Typography>
        <Box position="relative" mb="4rem">
          <TextField
            sx={{
              input: { fontWeight: "700", border: "none", borderRadius: "4px" },
              width: { lg: "70rem", s: "20rem" },
              backgroundColor: "white",
            }}
            height="3rem"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            placeholder="Search Exercise Library"
            type="text"
          />
          <Button
            className="librarySearchBtn"
            sx={{
              background:
                "linear-gradient(to right, #644fd5, #6aabe2, #c865d4)",
              color: "white",
              textTransform: "none",
              width: { lg: "10rem", xs: "6rem" },
              height: { xs: "3.5rem" },
              fontSize: { lg: "1.5rem", xs: "1rem" },
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
        <Box sx={{ postion: "relative", width: "100%", p: "1.25rem" }}>
          <HorizontalScroll
            isBodyPart
            data={bodyParts}
            bodyPart={bodyPart}
            setBodyPart={setBodyPart}
            bodyParts={bodyParts}
          />
        </Box>
      </Stack>
    </div>
  );
}

export default ExerciseLibrary;
