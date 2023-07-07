import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      component="footer"
      mt="auto"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 2,
        textAlign: "center",
        position: "static",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} ElevateExcellence
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
