import React from "react";
import { Stack, Typography } from "@mui/material";
import Gym from "../Images/gym.png";

function BodyPart({ item, setBodyPart, bodyPart }) {
  return (
    <Stack
      type="button"
      alignItems="center"
      justifyContent="center"
      className="bodyPart-card"
      sx={{
        borderTop: bodyPart === item ? "4px solid black" : " ",
        backgroundColor: "#fff",
        width: "270px",
        height: "260px",
        cursor: "pointer",
        gap: "47px",
      }}
      onClick={() => {
        setBodyPart(item);
        window.scrollTo({ top: 600, behavior: "smooth" });
      }}
    >
      <img src={Gym} alt="gym icon" style={{ width: "3rem", height: "3rem" }} />
      <Typography
        fontSize="1.5rem"
        fontWeight="bold"
        color="black"
        textTransform="capitalize"
      >
        {item}
      </Typography>
    </Stack>
  );
}

export default BodyPart;
