import React from "react";
import { Typography, Stack, Button, Tooltip } from "@mui/material";
import Musclegroup from "../../assets/Images/musclegroup.png";
import TargetImage from "../../assets/Images/targetmuscle.png";
import GymEquipment from "../../assets/Images/gymequipment.png";

function Information({ exerciseInformation }) {
  const { bodyPart, gifUrl, name, target, equipment } = exerciseInformation;

  const extraInformation = [
    {
      icon: Musclegroup,
      name: bodyPart,
      tooltip: "Muscle Group",
    },
    {
      icon: TargetImage,
      name: target,
      tooltip: "Target Muscle",
    },
    {
      icon: GymEquipment,
      name: equipment,
      tooltip: "Equipment Needed",
    },
  ];

  return (
    <Stack
      gap="4rem"
      sx={{ flexDirection: { lg: "row" }, p: "1.5rem", alignItems: "center" }}
    >
      <img src={gifUrl} alt={name} loading="lazy" className="detail-image" />
      <Stack sx={{ gap: { lg: "2rem", xs: "1.5rem" } }}>
        <Typography variant="h3" textTransform="capitalize">
          {name}
        </Typography>
        <Typography variant="h5">
          {name} - a great way to target your {bodyPart}. Make sure to focus on
          form to get the most out of the exercise and avoid injury. Remember to
          progressively overload to challenge yourself and induce hypertrophy.
        </Typography>
        {extraInformation.map((item) => (
          <Stack
            key={`${item.name}-${item.tooltip}`} // Updated key for uniqueness
            direction="row"
            gap="1.5rem"
            alignItems="center"
          >
            <Tooltip title={item.tooltip} placement="top">
              <Button
                sx={{
                  background: "#6aabe2",
                  borderRadius: "50%",
                  width: "100px",
                  height: "100px",
                }}
              >
                <img
                  src={item.icon}
                  alt={bodyPart}
                  style={{ width: "50px", height: "50px" }}
                />
              </Button>
            </Tooltip>
            <Typography variant="h6" textTransform="capitalize">
              {item.name}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default Information;
