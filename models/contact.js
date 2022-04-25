/* eslint-disable no-undef */
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const URI = process.env.MONGODB_URI;

// Initiate Mongoose
mongoose
  .connect(URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message}`);
  });

// Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minLength: 3 },
  phoneNumber: {
    type: String,
    required: true,
    unique: false,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{1,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

contactSchema.plugin(uniqueValidator);
contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
