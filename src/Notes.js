import React from "react";
import TextField from "@mui/material/TextField";

function TextBox(props) {
  return (
    <TextField
      className="notes"
      id="outlined-multiline-flexible"
      label="Notes"
      multiline
      maxRows={4}
      value={props.notes}
      onChange={props.onChange}
    />
  );
}

export default TextBox;
