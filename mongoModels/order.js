const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  date: {
    type: String,
  },
  price: {
    type: Number,
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
  },
  name: {
    type: String,
  },
  quantity: {
    type: Number,
  },
});

module.exports = model("Order", orderSchema);
