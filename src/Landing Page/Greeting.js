import React from "react";
import "../styles.css";
import Typography from "@mui/material/Typography";
import CallToAction from "./CallToAction";
import smartphone from "../Images/smartphone.jpg";

function Greeting() {
  return (
    <div className="greetingContainer">
      <div className="greeting">
        <Typography fontSize={"5rem"}>
          <span>
            <b>Elevate</b>
          </span>{" "}
          your workouts,
        </Typography>
        <Typography variant="h2" gutterBottom>
          redefine{" "}
          <span>
            <b>excellence</b>
          </span>{" "}
        </Typography>
        <Typography variant="h5" gutterButtom>
          Track. Progress. Elevate. Unleash your potential.
        </Typography>
        <CallToAction />
      </div>
      {/* <img className="smartphonecss" src={smartphone} alt="Smartphone" /> */}
    </div>
  );
}

export default Greeting;
