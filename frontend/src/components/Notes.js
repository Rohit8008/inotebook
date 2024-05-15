import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext from '../context/notes/NoteContext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

export const Notes = (props) => {
  let navigate = useNavigate();
  const context = useContext(NoteContext);
  const { notes, getNotes, editNote } = context;

  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    }
    else{
      navigate("/login");
    }
    // eslint-disable-next-line 
  }, []);

  const ref = useRef(null);
  const refclose = useRef(null);

  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

  const updateNote = (currentnote) => {
    ref.current.click();
    setNote({ id: currentnote._id, etitle: currentnote.title, edescription: currentnote.description, etag: currentnote.tag });
  };

  const handleClick = (e) => {
    console.log("Updating note");
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refclose.current.click();
    props.showAlert("Updated Successfully", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote showAlert={props.showAlert} />
      {/* Modal */}
      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className='my-3'>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" value={note.etitle} name="etitle" aria-describedby="emailHelp" onChange={onChange} minLength={3} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" value={note.edescription} name="edescription" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">TAG</label>
                  <input type="text" className="form-control" id="etag" value={note.etag} name="etag" onChange={onChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refclose}>Close</button>
              <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="button" onClick={handleClick} className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-2">
        {Array.isArray(notes) && notes.length > 0 ? (
          notes.map((note) => (
            <Noteitem key={note._id} showAlert={props.showAlert} updateNote={updateNote} note={note} />
          ))
        ) : (
          <div>No Note to Display</div>
        )}
      </div>
    </>
  );
};
