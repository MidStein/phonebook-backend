const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log(`Connecting to MongoDB at ${url}`);

mongoose
  .connect(url)
  .then((response) => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(`Error while connecting to MongoDB: ${error.message}`);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);