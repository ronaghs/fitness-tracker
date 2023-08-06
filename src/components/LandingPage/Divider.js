import React from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import "../../styles.css";

function Divider() {
  return (
    <div className="divider">
      <Box className="dividerText">
        <Typography fontWeight="bold" variant="h4" gutterBottom>
          Why Track Workouts?
        </Typography>
        <Typography variant="h6">
          Progressive overload is a fundamental principle of lifting, and
          tracking your workouts helps ensure continuous progression. By
          monitoring your exercises, weights, and repetitions, you can
          thoughtfully increase intensity and challenge your muscles need to
          grow stronger and promote hypertrophy. Tracking empowers you to
          optimize your training, gradually push your limits, and achieve
          progressive overload for consistent gains in strength and muscle
          development.
        </Typography>
      </Box>
    </div>
  );
}

export default Divider;
