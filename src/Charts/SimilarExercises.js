import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import HorizontalScroll from "./HorizontalScroll";
import Loader from "./Loader";
import { Work } from "@mui/icons-material";

function SimilarExercises({ targetMuscleExercises }) {
  return (
    <Box sx={{ mt: { lg: "100px", xs: "0" } }}>
      <Typography variant="h4">
        Alternatives targeting the same muscle group
      </Typography>
      <Stack direction="row" sx={{ p: "2", position: "relative" }}>
        {targetMuscleExercises.length ? (
          <HorizontalScroll data={targetMuscleExercises} />
        ) : (
          <Loader />
        )}
      </Stack>
    </Box>
  );
}

export default SimilarExercises;

// might Work
// import React from "react";
// import { Box, Stack, Typography } from "@mui/material";
// import ExerciseCard from "./ExerciseCard";
// import Loader from "./Loader";

// function SimilarExercises({ targetMuscleExercises }) {
//   return (
//     <Box sx={{ mt: { lg: "100px", xs: "0" }, mb: { lg: "50px", xs: "0" } }}>
//       <Typography variant="h4" mb={4}>
//         Alternatives targeting the same muscle group
//       </Typography>
//       <Stack direction="row" sx={{ p: "2", position: "relative" }}>
//         {targetMuscleExercises.length !== 0 ? (
//           targetMuscleExercises.map((exercise) => (
//             <ExerciseCard key={exercise.id} exercise={exercise} />
//           ))
//         ) : (
//           <Loader />
//         )}
//       </Stack>
//     </Box>
//   );
// }

// export default SimilarExercises;
