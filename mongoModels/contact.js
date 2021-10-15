const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
  },
  position: {
    type: String,
  },
  email: {
    type: String,
  },
});

module.exports = model("Contact", contactSchema);
