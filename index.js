require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
}

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('build'));

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => (next(error)));
})

app.get('/info', (request, response) => {
  Person
    .count({})
    .then((result) => {
      response.send(
        `<p>Phonebook has info for ${result} people</p><p>${new Date().toString()}`
      );
    });

});

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then((note) => {
      response.json(note);
    })
    .catch((error) => (next(error)));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then((deletedPerson) => {
      response.status(204).end();
    })
    .catch((error) => (next(error)));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });
  person
    .save()
    .then((person) => {
      response.json(person);
    })
    .catch((error) => (next(error)));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number
  };

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => (next(error)));
})

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});