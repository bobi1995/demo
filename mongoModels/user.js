const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  position: { type: String },
  salary: { type: Number },
});

module.exports = model("User", userSchema);
