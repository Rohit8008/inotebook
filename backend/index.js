const express = require('express');
var cors = require('cors');
const connectToMongo = require('./db');
connectToMongo();

require("dotenv").config();

const app = express();
const port = process.env.PORTB || 5000;

app.use(cors());
app.use(express.json());

//Available Roues
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

// Default Route
app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.listen(port,()=>{
    console.log(`iNoteBook listening at http://localhost:${port}`);
})