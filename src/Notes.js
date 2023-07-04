import React, { useEffect, useState, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { db, auth } from "./firebaseConfig";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

function Notes({ date }) {
  const [newNote, setNewNote] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [note, setNote] = useState("");
  const [userUid, setUserUid] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteError, setNoteError] = useState(false); // State variable for input validation
  const notesInputRef = useRef(null); // Reference to the notes input TextField

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const notesCollectionRef = userUid
    ? collection(db, "users", userUid, "notes")
    : null;

  const getNotes = async () => {
    try {
      const querySnapshot = await query(
        notesCollectionRef,
        where("date", "==", date)
      );
      const data = await getDocs(querySnapshot);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNewNote(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const submitNote = async () => {
    if (!note) {
      setNoteError(true); // Show validation error if note is empty
      return;
    }

    try {
      if (notesCollectionRef) {
        if (editingNoteId) {
          const noteDoc = doc(notesCollectionRef, editingNoteId);
          await updateDoc(noteDoc, {
            note: note,
            date: date, // Add the date to the note
          });
          setEditingNoteId(null);
        } else {
          await addDoc(notesCollectionRef, {
            note: note,
            date: date, // Add the date to the note
          });
        }
        setNote("");
        setNoteError(false); // Reset validation error
        getNotes();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNote = async (id) => {
    if (notesCollectionRef) {
      const noteDoc = doc(notesCollectionRef, id);
      await deleteDoc(noteDoc);
    }
  };

  const editNote = (noteId) => {
    const noteToEdit = newNote.find((note) => note.id === noteId);
    if (noteToEdit) {
      setEditingNoteId(noteToEdit.id);
      setNote(noteToEdit.note);
      setOpenDrawer(true);

      // Set focus on the notes input TextField
      if (notesInputRef.current) {
        notesInputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (notesCollectionRef) {
      getNotes();
    }
  }, [notesCollectionRef]);

  return (
    <div>
      <Button
        id="viewNotesButton"
        onClick={handleOpenDrawer}
        variant="outlined"
      >
        View Notes
      </Button>
      <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
        <TextField
          variant="outlined"
          label="Notes"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          error={noteError} // Add error prop to TextField
          helperText={noteError && "Please enter a note"} // Display helper text if there's a validation error
          rows={4}
          cols={50}
          style={{ resize: "none" }}
          inputRef={notesInputRef} // Set the ref to the input TextField
        />
        <Button onClick={submitNote}>
          {editingNoteId ? "Update Note" : "Add Note"}
        </Button>
        <div>
          {newNote.map((note) => (
            <div key={note.id}>
              <h1>{note.note}</h1>
              <Tooltip title="Delete note">
                <IconButton
                  onClick={() => deleteNote(note.id)}
                  aria-label="delete"
                  sx={{ color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Set">
                <IconButton
                  onClick={() => editNote(note.id)}
                  aria-label="edit"
                  sx={{ color: "green" }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}

export default Notes;
