const express = require("express");
const app = express();
const connection = require("./config-db");

const port = 5000;

const personsRouter = require("./routes/persons.route");

connection.connect((error) => {
  error
    ? console.log(error)
    : console.log(`Connected to database at thread: ${connection.threadId}`);
});

app.use(express.json());

app.use("/persons", personsRouter);

app.listen(port, (error) => {
  error ? console.log(error) : console.log(`App is running at port ${port}`);
});
