const express = require('express')
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

const router = express.Router();

//Route 1 : Get all the Notes : Get "/api/notes/fetchallnotes" : Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//Route 2 : Add a new Note : Post "/api/notes/addnote" : Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid Title').isLength({ min: 5 }),
    body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //if there are errors, return bad request and the errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: "Fields Cant be Empty" });
        }

        const note = new Notes({
            title, description, tag,
            user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (err) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//Router 3 : Update an existing Note using : PUT "/api/notes/updatenote/:id" Login Required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        var note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).json({success:false,error:"Not Found"});
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({success:false,error:"Not Allowed"});
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (err) {
        res.status(500).json({success:false,error:"Internal Server Error"});
    }
})

//Route 4 : Delete an Exisiting Note using : Delete "/api/notes/deletenote/:id" Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //Find the note to be deleted and delete it 
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).json({success:false,error:"Not Found"});
        }
        //Allow deleteion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({success:false,error:"Not Allowed"});
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (err) {
        res.status(500).json({success:false,error:"Internal Server Error"});
    }

});

module.exports = router;