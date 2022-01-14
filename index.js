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
app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((result) =>
      result ? response.json(result) : response.status(404).end()
    )
    .catch((err) => next(err));
});

// CREATE A SINGLE PERSON
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // Check Body Parameter
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const newContact = new Contact({
    name: body.name,
    phoneNumber: body.number,
  });

  newContact
    .save()
    .then((result) => response.json(result))
    .catch((err) => next(err));
});

// DELETE SINGLE PERSON
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Contact.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((err) => next(err));
});

// UPDATE SINGLE PERSON
app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const updatedPersonBody = {
    name: body.name,
    phoneNumber: body.number,
  };

  Contact.findByIdAndUpdate(id, updatedPersonBody, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((err) => next(err));
});

// SHOW PHONEBOOK INFO
app.get("/info", (request, response) => {
  const date = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> ${date}`
  );
});

const errorHandler = (error, request, response, next) => {
  console.log(error.name);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

// App Listener
app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
