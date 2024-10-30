import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db =  new pg.Client({
  user: "postgres",
  host: "127.0.0.1",
  database: "permalist",
  password: "system",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const newTitle = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = $1 WHERE id = $2",[newTitle, itemId]);

  res.redirect("/");

});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1", [deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
