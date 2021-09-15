const { Schema, model } = require("mongoose");

const itemSchema = new Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

module.exports = model("Item", itemSchema);
