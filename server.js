const express = require("express");
const fs = require("fs");

const path = require("path");
const uuid = require("uuid");



const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Setting routes for APIs
//This gets notes saved and joins it in db.json
app.get("/api/notes", (req, res)=>{
    let file=fs.readFileSync(path.join(__dirname,"db/db.json"));
    file=JSON.parse(file)
    res.json(file)
});

// Post function to add new notes 
app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync("db/db.json", JSON.stringify(notes))
    res.json(notes);
});

//used for deleting notes
app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("db/db.json"));
    const delNote = notes.filter((note) => note.id !== req.params.id);
    fs.writeFileSync("db/db.json", JSON.stringify(delNote));
    res.json(delNote);
})


//HTML calls

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname,"public", "notes.html"));
});
//call for notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname,"public", "notes.html"));
});




app.listen(PORT, ()=> console.log(`The Note Taker is Listing on PORT ${PORT}`));