const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the arguments: node mongo.js <password> <name> <phonenumber>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb://raihan259:${password}@fullstackopen-shard-00-00.apxao.mongodb.net:27017,fullstackopen-shard-00-01.apxao.mongodb.net:27017,fullstackopen-shard-00-02.apxao.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-wfvo4i-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length > 3) {
  // Create a new person
  const name = process.argv[3];
  const phoneNumber = process.argv[4];

  const contact = new Contact({
    name,
    phoneNumber,
  });

  return contact.save().then((result) => {
    console.log(`added ${name} number ${phoneNumber} to phonebook`);
    mongoose.connection.close();
  });
}

// Display Person Only
console.log("phonebook:");
Contact.find({}).then((result) => {
  result.forEach((contactData) => {
    console.log(`${contactData.name} ${contactData.phoneNumber}`);
  });
  mongoose.connection.close();
});
