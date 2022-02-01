const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());
app.use(cors());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(process.env.PORT || 3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/todos/", async (request, response) => {
  let data = null;
  const getTodosQuery = `select * from todo`;
  data = await database.all(getTodosQuery);
  response.send(data);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, isChecked } = request.body;
  const postTodoQuery = `
  INSERT INTO
    todo
  VALUES
    (${id}, '${todo}', '${isChecked}');`;
  await database.run(postTodoQuery);
  const success = {
    status: 200,
    message: "Todo Successfully Added",
  };
  response.send(success);
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
  DELETE FROM
    todo
  WHERE
    id = ${todoId};`;

  await database.run(deleteTodoQuery);
  const success = {
    status: 200,
    message: "Todo Successfully Deleted",
  };
  response.send(success);
});

module.exports = app;
