import React, { useEffect, useState } from "react";
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
} from "firebase/firestore";

function Notes({ date }) {
  const [newNote, setNewNote] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [note, setNote] = useState("");
  const [userUid, setUserUid] = useState(null);

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
    try {
      if (notesCollectionRef) {
        await addDoc(notesCollectionRef, {
          note: note,
          date: date, // Add the date to the note
        });
        setNote("");
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
          placeholder="Notes"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          cols={50}
          style={{ resize: "none" }}
        />
        <Button onClick={submitNote}>Add note</Button>
        <div>
          {newNote.map((note) => (
            <div key={note.id}>
              <h1>{note.note}</h1>
              <Button onClick={() => deleteNote(note.id)}>Delete Note</Button>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}

export default Notes;
