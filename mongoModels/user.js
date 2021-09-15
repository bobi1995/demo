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
  type: {
    type: String,
  },
});

module.exports = model("User", userSchema);
