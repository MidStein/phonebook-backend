const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('password argument required');
  process.exit(1);
}

const password = process.argv[2];
const url = 
  `mongodb+srv://deepak:${password}@cluster0.7ae8baw.mongodb.net/phonebook?
  retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 3) {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({ name, number });
  person
    .save()
    .then(() => {
      console.log('person saved!');
      mongoose.connection.close();
    });
} else {
  Person
    .find({})
    .then((persons) => {
      persons.forEach((person) => {
        console.log(person);
      })
      mongoose.connection.close();
    });
}
