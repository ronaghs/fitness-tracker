import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const navigate = useNavigate();

  const handleDayClick = (eventInfo) => {
    const clickedDate = eventInfo.dateStr;
    setSelectedDate(clickedDate);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGoClick = () => {
    setOpen(false);
    // Redirect to Learn component with the selected date and event title
    navigate(`/learn/${selectedDate}/${encodeURIComponent(eventTitle)}`);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDayClick}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" mb={2}>
            Selected Date: {selectedDate}
          </Typography>
          <TextField
            label="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            onClick={handleGoClick}
            variant="contained"
            color="success"
            mr={2}
          >
            Go
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Calendar;
