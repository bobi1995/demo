const { Schema, model } = require("mongoose");

const clientSchema = new Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
    require: true,
  },
  orders: {
    type: String,
  },
  logo: {
    type: String,
  },
  website: {
    type: String,
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  contact: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
});

module.exports = model("Client", clientSchema);
