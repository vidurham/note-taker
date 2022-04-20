const express = require('express');
const path = require("path");
const fs = require('fs');
const db = require('./db/db.json')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));


app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(data)
        res.json(JSON.parse(data));
    });
});


app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    db.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(db)
    );
    res.json(newNote);
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