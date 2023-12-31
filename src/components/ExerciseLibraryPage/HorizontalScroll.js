import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import BodyPart from "./BodyPart";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import RightArrowIcon from "../../assets/Images/right-arrow.png";
import LeftArrowIcon from "../../assets/Images/left-arrow.png";
import ExerciseCard from "./ExerciseCard";
import Gym from "../../assets/Images/gym.png";
import Back from "../../assets/Images/back.png";
import abs from "../../assets/Images/abs.png";
import arms from "../../assets/Images/arms.png";
import cardio from "../../assets/Images/cardio.png";
import chest from "../../assets/Images/chest.png";
import lowerleg from "../../assets/Images/lowerleg.png";
import neck from "../../assets/Images/neck.png";
import quads from "../../assets/Images/quads.png";
import shoulders from "../../assets/Images/shoulders.png";
import forearm from "../../assets/Images/forearm.png";

const LeftArrow = () => {
  const { scrollPrev } = useContext(VisibilityContext);

  return (
    <Typography onClick={() => scrollPrev()} className="right-arrow">
      <img src={LeftArrowIcon} alt="right-arrow" />
    </Typography>
  );
};

const RightArrow = () => {
  const { scrollNext } = useContext(VisibilityContext);

  return (
    <Typography onClick={() => scrollNext()} className="left-arrow">
      <img src={RightArrowIcon} alt="right-arrow" />
    </Typography>
  );
};

const icons = [
  Gym,
  Back,
  cardio,
  chest,
  forearm,
  lowerleg,
  neck,
  shoulders,
  arms,
  quads,
  abs,
];

const HorizontalScrollbar = ({ data, bodyParts, setBodyPart, bodyPart }) => (
  <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
    {data.map((item, index) => (
      <Box
        key={item.id || item}
        itemID={item.id || item}
        title={item.id || item}
        m="0 40px"
      >
        {bodyParts ? (
          <BodyPart
            item={item}
            icon={icons[index % icons.length]}
            setBodyPart={setBodyPart}
            bodyPart={bodyPart}
          />
        ) : (
          <ExerciseCard exercise={item} />
        )}
      </Box>
    ))}
  </ScrollMenu>
);

export default HorizontalScrollbar;
