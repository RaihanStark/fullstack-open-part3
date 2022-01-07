// Initializing App
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Contact = require("./models/contact");

const app = express();
const PORT = process.env.PORT || 3001;

morgan.token("data", function getData(req) {
  return JSON.stringify(req.body);
});

// Middleware

app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :response-time ms :data"));
app.use(express.static("build"));

// Generate Random ID
const generateRandomID = () => {
  return Math.floor(Math.random() * 10000);
};

// GET
app.get("/api/persons", (request, response) => {
  Contact.find().then((result) => response.json(result));
});

// GET SINGLE PERSON
app.get("/api/persons/:id", (request, response) => {
  Contact.findById(request.params.id)
    .then((result) =>
      result ? response.json(result) : response.status(404).end()
    )
    .catch((err) => response.status(404).end());
});

// CREATE A SINGLE PERSON
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // Check Body Parameter
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  // // Check Duplication
  // const duplication = persons.find((person) => person.name === body.name);
  // if (duplication) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const newContact = new Contact({
    name: body.name,
    phoneNumber: body.number,
  });

  newContact.save().then((result) => response.json(result));
});

// DELETE SINGLE PERSON
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

// SHOW PHONEBOOK INFO
app.get("/info", (request, response) => {
  const date = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> ${date}`
  );
});

// App Listener
app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
