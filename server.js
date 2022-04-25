const express = require('express');
const path = require("path");
const fs = require('fs');
const db = require('./db/db.json');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));


app.get('/api/notes', (req, res) => {
    res.json(db)
});


app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = randomUUID();
    db.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(db)
    );
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id
    
    const notesArray = JSON.parse(db);
    
    const newNotes = notesArray.filter((note) => { 
        return note.id !== noteId});

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(newNotes)
    );
    res.json(req.body)
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server now on port ${PORT}!`);
});