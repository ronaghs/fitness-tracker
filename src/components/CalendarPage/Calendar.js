import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import { motion } from "framer-motion";

const Calendar = () => {
  const [open, setOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [calendarKey, setCalendarKey] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const workoutsCollectionRef = collection(userDocRef, "workouts");
        const userEventsQuery = query(
          workoutsCollectionRef,
          where("userId", "==", user.uid)
        );

        const unsubscribeEvents = onSnapshot(userEventsQuery, (snapshot) => {
          const updatedEvents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(updatedEvents);
        });

        return () => {
          unsubscribeEvents();
        };
      } else {
        setEvents([]);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr;
    const existingEvent = events.find((event) => event.date === clickedDate);

    if (existingEvent) {
      // An event already exists for the clicked date, navigate to the trackingpage component
      navigate(
        `/log/${clickedDate}/${encodeURIComponent(existingEvent.title)}`
      );
    } else {
      setSelectedDate(clickedDate);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEventTitle("");
  };

  const handleAddEvent = async () => {
    const maxLength = 30; // Maximum number of characters for the event title
    let truncatedTitle = eventTitle;

    if (eventTitle.length > maxLength) {
      truncatedTitle = eventTitle.substring(0, maxLength);
    }

    const existingEvent = events.find((event) => event.date === selectedDate);

    if (existingEvent) {
      // An event already exists for the selected date, navigate to the trackingpage component
      navigate(
        `/log/${selectedDate}/${encodeURIComponent(existingEvent.title)}`
      );
      handleClose();
      return;
    }

    const event = {
      title: truncatedTitle,
      date: selectedDate,
      weight: 0,
      reps: 0,
      set: 0,
      userId: auth.currentUser.uid, // Add the userId field to the event
    };

    try {
      const user = auth.currentUser;
      if (!user) {
        // User is not authenticated, handle accordingly
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const workoutsCollectionRef = collection(userDocRef, "workouts");
      await addDoc(workoutsCollectionRef, event);
      handleClose();

      // Redirect to trackingpage component for the new event after a brief delay
      setTimeout(() => {
        navigate(
          `/log/${selectedDate}/${encodeURIComponent(event.title)}` // Pass event title as a URL parameter
        );
      }, 500); // 0.5 second delay before redirected
    } catch (error) {
      console.error("Error adding event to Firestore:", error);
    }
  };

  const handleDeleteEvent = async (eventId, event) => {
    event.stopPropagation(); // Stop event propagation to prevent navigation when clicking the delete icon

    try {
      const user = auth.currentUser;
      if (!user) {
        // User is not authenticated, handle accordingly
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const workoutDocRef = doc(collection(userDocRef, "workouts"), eventId);
      await deleteDoc(workoutDocRef);
    } catch (error) {
      console.error("Error deleting event from Firestore:", error);
    }
  };

  const handleEventClick = (arg) => {
    const clickedEvent = arg.event;
    const eventDate = clickedEvent.start;

    if (eventDate && clickedEvent.title) {
      const clickedDate = eventDate.toISOString().split("T")[0];
      navigate(`/log/${clickedDate}/${encodeURIComponent(clickedEvent.title)}`);
    }
  };

  const eventContent = (eventInfo) => {
    return (
      <div className="event-container">
        <div className="event-wrapper">
          <Typography>{eventInfo.event.title}</Typography>
          <IconButton
            sx={{ color: "red" }}
            onClick={(event) => handleDeleteEvent(eventInfo.event.id, event)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    );
  };

  const modalAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <div className="calendar">
      <FullCalendar
        key={calendarKey}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        eventContent={eventContent}
        eventClick={handleEventClick} // Handle event click
        height={"90vh"}
      />

      <Modal open={open} onClose={handleClose}>
        <motion.div
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          exit="exit"
          variants={modalAnimation}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "8px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h5" mb={2}>
              Add Workout
            </Typography>
            <TextField
              label="Workout name"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              onClick={handleAddEvent}
              variant="contained"
              color="primary"
              disabled={!eventTitle}
            >
              Let's go
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              color="error"
              ml={2}
            >
              Cancel
            </Button>
          </Box>
        </motion.div>
      </Modal>
    </div>
  );
};

export default Calendar;
