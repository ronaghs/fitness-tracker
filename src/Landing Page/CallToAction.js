import React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ForwardIcon from "@mui/icons-material/Forward";
import { NavLink } from "react-router-dom";

function CallToAction() {
  return (
    <Box sx={{ "& > :not(style)": { ml: 0, mt: 3 } }}>
      <NavLink to="/signup">
        <Fab variant="extended" size="large" color="primary" aria-label="add">
          Get Started
          <ForwardIcon sx={{ ml: 1 }} />
        </Fab>
      </NavLink>
    </Box>
  );
}

export default CallToAction;
