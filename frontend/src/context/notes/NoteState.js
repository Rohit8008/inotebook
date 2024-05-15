import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = process.env.REACT_APP_B_URL;
  const [notes, setNotes] = useState([]);

  // Get All notes 
  const getNotes = async () => {

    const url = host + `/api/notes/fetchallnotes`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json = await response.json();
    // console.log(json);
    setNotes(json);
  }

  //Add A note 
  const addNote = async (title, description, tag) => {

    const url = host + `/api/notes/addnote`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const note = await response.json();
    setNotes([...notes, note]);
  }

  //Delete a note 
  const deleteNote = async (id) => {
    //API CALL
    const url = host + `/api/notes/deletenote/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json = await response.json();
    console.log(json);

    // console.log("Deleting the node with id " + id);
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }


  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //Api call
    const url = host + `/api/notes/updatenote/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem("token")
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = await response.json();
    console.log(json);

    //logic
    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }


  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;
