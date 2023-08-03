import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import ExerciseCard from "./ExerciseCard";
import Loader from "./Loader";

function SimilarExercises({ targetMuscleExercises }) {
  const containerRef = useRef(null);
  const [isHorizontalScrolling, setHorizontalScrolling] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = (event) => {
      const containerBottom = container.scrollHeight - container.clientHeight;
      const containerRight = container.scrollWidth - container.clientWidth;

      if (container.scrollTop === containerBottom) {
        setHorizontalScrolling(true);
      } else if (container.scrollLeft === containerRight) {
        setHorizontalScrolling(false);
      }

      if (isHorizontalScrolling) {
        container.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    };

    container.addEventListener("wheel", handleScroll);

    return () => {
      container.removeEventListener("wheel", handleScroll);
    };
  }, [isHorizontalScrolling]);

  return (
    <Box sx={{ mt: { lg: "100px", xs: "0" }, mb: { lg: "50px", xs: "0" } }}>
      <Typography variant="h4" mb={4} mt={3}>
        Alternatives:
      </Typography>
      <Box
        sx={{
          p: "2",
          position: "relative",
          overflowX: isHorizontalScrolling ? "auto" : "hidden",
          display: "flex",
          flexDirection: "row", // Maintain the row orientation
          flexWrap: "nowrap",
          alignItems: "center",
        }}
        ref={containerRef}
      >
        {targetMuscleExercises.length !== 0 ? (
          targetMuscleExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))
        ) : (
          <Loader />
        )}
      </Box>
    </Box>
  );
}

export default SimilarExercises;
