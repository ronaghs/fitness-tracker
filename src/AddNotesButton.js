import React from "react";
import Button from "@mui/material/Button";

export function AddNotesButton(props) {
  return (
    <Button onClick={props.onClick} variant="contained" color="primary">
      Add Notes
    </Button>
  );
}
