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
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Update with your Firebase configuration
import { onAuthStateChanged } from "firebase/auth";

const Calendar = () => {
  const [open, setOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventIdCounter, setEventIdCounter] = useState(1);
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
      // An event already exists for the clicked date, navigate to the "Learn" component
      navigate(
        `/learn/${clickedDate}/${encodeURIComponent(existingEvent.title)}`
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
    const maxLength = 20; // Maximum number of characters for the event title
    let truncatedTitle = eventTitle;

    if (eventTitle.length > maxLength) {
      truncatedTitle = eventTitle.substring(0, maxLength);
    }

    const existingEvent = events.find((event) => event.date === selectedDate);

    if (existingEvent) {
      // An event already exists for the selected date, navigate to the "Learn" component
      navigate(
        `/learn/${selectedDate}/${encodeURIComponent(existingEvent.title)}`
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

      // Redirect to Learn component for the new event after a brief delay
      setTimeout(() => {
        navigate(`/learn/${selectedDate}/${encodeURIComponent(event.title)}`);
      }, 1000); // 1 second delay
    } catch (error) {
      console.error("Error adding event to Firestore:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
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
      navigate(
        `/learn/${clickedDate}/${encodeURIComponent(clickedEvent.title)}`
      );
    }
  };

  const eventContent = (eventInfo) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography style={{ marginRight: "auto" }}>
          {eventInfo.event.title}
        </Typography>
        <IconButton
          sx={{ color: "red" }}
          onClick={() => handleDeleteEvent(eventInfo.event.id)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  };

  const reloadCalendar = () => {
    setCalendarKey(Date.now());
  };

  return (
    <div>
      <FullCalendar
        key={calendarKey}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        eventContent={eventContent}
        eventClick={handleEventClick} // Handle event click
        height={"95vh"}
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
            Add Event
          </Typography>
          <TextField
            label="Event Title"
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
            Add and Go
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
      </Modal>
    </div>
  );
};

export default Calendar;
