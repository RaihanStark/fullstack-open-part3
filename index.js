// Initializing App
const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = 3001;

morgan.token("data", function getData(req) {
  return JSON.stringify(req.body);
});

// Middleware
app.use(express.json());
app.use(morgan(":method :url :status :response-time ms :data"));

// Generate Random ID
const generateRandomID = () => {
  return Math.floor(Math.random() * 10000);
};

// Data
persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// GET
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// GET SINGLE PERSON
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
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

  // Check Duplication
  const duplication = persons.find((person) => person.name === body.name);
  if (duplication) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: generateRandomID(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(newPerson);

  response.json(newPerson);
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
