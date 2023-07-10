import React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ForwardIcon from "@mui/icons-material/Forward";
import { NavLink } from "react-router-dom";

function CallToAction() {
  return (
    <Box sx={{ mt: 2 }}>
      <NavLink to="/signup">
        <Fab
          variant="extended"
          size="large"
          color="primary"
          aria-label="add"
          sx={{
            background: "linear-gradient(to right, #483c90, #4d8ac0, #a449b7)",
          }}
        >
          Get Started
          <ForwardIcon sx={{ ml: 1 }} />
        </Fab>
      </NavLink>
    </Box>
  );
}

export default CallToAction;
