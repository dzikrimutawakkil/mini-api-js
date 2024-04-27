const express = require("express");
const db = require("./database");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  console.log(title);
  db.query(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content],
    (error, results) => {
      if (error) res.send({"message" : "titlle"});
      res.send({ id: results.insertId, title, content });
    }
  );
});

app.get("/notes", (req, res) => {
  db.query("SELECT * FROM notes", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM notes WHERE id = ?", [id], (error, results) => {
    if (error) throw error;
    if (results.length > 0) res.send(results[0]);
    else res.status(404).send("Note not found");
  });
});


app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.query(
    "UPDATE notes SET title = ?, content = ? WHERE id = ?",
    [title, content, id],
    (error, result) => {
      if (error) throw error;
      if (result.affectedRows === 0) res.status(404).send("Note not found");
      else res.send({ id, title, content });
    }
  );
});


app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM notes WHERE id = ?", [id], (error, result) => {
    if (error) throw error;
    if (result.affectedRows === 0) res.status(404).send("Note not found");
    else res.send({ message: "Note deleted" });
  });
});


app.listen(port, () => {
  console.log(`Note app listening at http://localhost:${port}`);
});
