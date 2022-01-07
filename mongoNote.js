const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb://raihan259:${password}@fullstackopen-shard-00-00.apxao.mongodb.net:27017,fullstackopen-shard-00-01.apxao.mongodb.net:27017,fullstackopen-shard-00-02.apxao.mongodb.net:27017/notes?ssl=true&replicaSet=atlas-wfvo4i-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "HTML is Easy",
  date: new Date(),
  important: true,
});

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
