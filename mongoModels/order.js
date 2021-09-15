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
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

module.exports = model("Order", orderSchema);
