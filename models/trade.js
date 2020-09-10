const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  tickerSymbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 2,
  },
  avgBuyPrice: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  shares: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
});

module.exports = mongoose.model("Trade", tradeSchema);
