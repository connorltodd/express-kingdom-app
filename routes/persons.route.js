// Shorthand for importing express and using router
// const router = require("express").Router();

const { request, response } = require("express");
const express = require("express");

// custom example to import express router to improve readability
const personsRouter = express.Router();
const connection = require("../config-db");

// default example of importing express router
// const router = express.Router();

personsRouter.post("/", (request, response) => {
  const newPerson = request.body;
  connection.query(
    "INSERT INTO Person SET ?",
    [newPerson],
    (error, results) => {
      if (error) response.status(500).send(error);
      else {
        const newPersonId = results.insertId;
        connection.query(
          "SELECT * FROM Person WHERE id = ?",
          [newPersonId],
          (error, results) => {
            if (error) response.status(500).send(error);
            else response.status(200).send(results[0]);
          }
        );
      }
    }
  );
});

personsRouter.put("/:id", (request, response) => {
  const personId = request.params.id;

  const { firstname, lastname, age, role_id, kingdom_id } = request.body;

  const personToEdit = {
    firstname,
    lastname,
    age,
    role_id,
    kingdom_id,
  };

  Object.keys(personToEdit).forEach(
    (key) => personToEdit[key] === undefined && delete personToEdit[key]
  );

  //   Object.keys(personToEdit).filter((key) => personToEdit[key] === undefined);

  connection.query(
    "UPDATE Person SET ? WHERE id = ?",
    [personToEdit, personId],
    (error, results) => {
      if (error) response.status(500).send(error);
      else {
        connection.query(
          "SELECT * FROM Person WHERE id = ?",
          [personId],
          (error, results) => {
            if (error) response.status(500).send(error);
            else response.status(200).send(results[0]);
          }
        );
      }
    }
  );
});

personsRouter.get("/", (request, response) => {
  connection.query(
    `SELECT Person.*, Role.role, Kingdom.name as kingdom_name FROM Person 
        JOIN Role ON Role.id = Person.role_id 
        JOIN Kingdom ON Kingdom.id = Person.kingdom_id;`,
    (error, results) => {
      if (error) response.status(500).send(error);
      else response.status(200).send(results);
    }
  );
});

module.exports = personsRouter;
