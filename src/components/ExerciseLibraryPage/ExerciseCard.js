import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";

function ExerciseCard({ exercise }) {
  return (
    <Link
      className="exercise-card"
      to={`/exercise/${exercise.id}`}
      style={{ textDecoration: "none" }}
    >
      <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" />

      <Typography
        ml="1rem"
        color="#000"
        fontWeight="bold"
        mt="0.5rem"
        pb="0.75rem"
        textTransform="capitalize"
        fontSize="1.1rem"
      >
        {exercise.name}
      </Typography>

      <Stack direction="row">
        <Button
          variant="text"
          sx={{
            width: "fit-content",
            ml: "1rem",
            mb: "1rem",
            color: "#fff",
            background: "#c865d4",
            fontSize: "1rem",
            textTransform: "capitalize",
            borderRadius: "1.5rem",
          }}
        >
          {exercise.bodyPart}
        </Button>
        <Button
          variant="text"
          sx={{
            width: "fit-content",
            mb: "1rem",
            ml: "1rem",
            color: "#fff",
            background: "#644fd5",
            fontSize: "1rem",
            textTransform: "capitalize",
            borderRadius: "1.5rem",
          }}
        >
          {exercise.target}
        </Button>
      </Stack>
    </Link>
  );
}

export default ExerciseCard;
