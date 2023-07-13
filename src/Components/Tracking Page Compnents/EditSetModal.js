import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const EditSetModal = ({
  openModal,
  handleCancelEdit,
  handleSaveEdit,
  tempReps,
  setTempReps,
  tempWeight,
  setTempWeight,
}) => {
  return (
    <Modal open={openModal} onClose={handleCancelEdit}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 200,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Set
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label>
            Reps
            <input
              className="editModalInput"
              type="number"
              value={tempReps}
              onChange={(e) => setTempReps(e.target.value)}
            />
          </label>
          <label>
            Weight
            <input
              className="editModalInput"
              type="number"
              value={tempWeight}
              onChange={(e) => setTempWeight(e.target.value)}
            />
          </label>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex", gap: 2, mt: 2 }}>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
          <Button onClick={handleCancelEdit} variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditSetModal;
