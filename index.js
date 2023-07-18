require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('build'));

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then((persons) => {
      response.json(persons);
    });
})

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}`
  );
});

app.get('/api/persons/:id', (request, response) => {
  Note
    .findById(request.params.id)
    .then((note) => {
      response.json(note);
    });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => (person.id !== id));
  
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    });
  // } else if (persons.some((person) => (person.name === body.name))) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   });
  // }
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });
  person
    .save()
    .then((person) => {
      response.json(person);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});