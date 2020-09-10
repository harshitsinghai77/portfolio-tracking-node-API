const router = require("express").Router();
const Trade = require("../../models/trade");
const { response } = require("../../utils/util");

const {
  NewTradeValidator,
  TradeUpdateSellValidator,
  TradeUpdateBuyValidator,
} = require("../../validator/");

// Get all trades
router.get("/", async (req, res) => {
  try {
    const trades = await Trade.find({});
    res.sendSuccess(response(true, "All Portfolio trades", trades));
  } catch (err) {
    console.log(err);
    res.sendInternalServerError();
  }
});

// Add new trade
router.post("/", async (req, res) => {
  try {
    const { error } = NewTradeValidator(req.body);
    console.log(error);
    if (error) return res.sendBadRequestError(error);

    const { tickerSymbol, avgBuyPrice, shares } = req.body;

    // check for existing symbol
    const isTickerExists = await Trade.findOne({ tickerSymbol });
    if (isTickerExists)
      return res.sendAlreadyExists(
        response(false, "Ticker already exists!", isTickerExists)
      );

    const newTrade = new Trade({
      tickerSymbol: tickerSymbol.toUpperCase(),
      avgBuyPrice,
      shares,
    });
    const savedTrade = await newTrade.save();
    res.sendResourceCreated(
      response(true, "Trade created and added to portfolio", savedTrade)
    );
  } catch (err) {
    console.log(err);
    res.sendInternalServerError();
  }
});

// Buy Trade
router.patch("/:trade_id/buys", async (req, res) => {
  try {
    const { error } = TradeUpdateBuyValidator(req.body);
    if (error) return res.sendBadRequestError(error);

    const trade_id = req.params.trade_id;
    let current_trade = await Trade.findById(trade_id);
    if (!current_trade)
      return res.sendNotFound(
        response(false, "Trade not found", current_trade)
      );

    const { shares, buyPrice } = req.body;
    const currentAvgBuyPrice = current_trade.avgBuyPrice;
    const currentShare = current_trade.shares;

    /* Update average value and shares
        updatedBuyPrice = (currentAvgBuyPrice * currentShare + shares * buyPrice) / (shares + currentShare);
    */

    const updatedBuyPrice =
      (currentAvgBuyPrice * currentShare + shares * buyPrice) /
      (shares + currentShare);

    current_trade.shares += Number.parseInt(shares);
    current_trade.avgBuyPrice = updatedBuyPrice.toFixed(2);

    const updatedTrade = await current_trade.save();
    res.sendSuccess(
      response(true, `Added ${shares} shares succesfully`, updatedTrade)
    );
  } catch (err) {
    console.log(err);
    res.sendInternalServerError();
  }
});

// Sell Trade
router.patch("/:trade_id/sells", async (req, res) => {
  try {
    const { error } = TradeUpdateSellValidator(req.body);
    if (error) return res.sendBadRequestError(error);

    const trade_id = req.params.trade_id;
    let current_trade = await Trade.findById(trade_id);

    if (!current_trade)
      return res.sendNotFound(
        response(false, "Trade not found", current_trade)
      );

    const { shares } = req.body;
    const currentShare = current_trade.shares;

    if (shares <= 0) {
      return res.sendBadRequestError(
        respone(false, "sell shares cannot be less than zero", null)
      );
    }

    current_trade.shares -= Number.parseInt(shares);
    if (current_trade.shares < 0) {
      return res.sendBadRequestError(
        response(
          false,
          `cannot sell more than ${currentShare} shares for this trade`,
          null
        )
      );
    }
    const updatedTrade = await current_trade.save();
    res.sendSuccess(
      response(true, `Total ${shares} shares sold succesfully`, updatedTrade)
    );
  } catch (err) {
    console.log(err);
    res.sendInternalServerError();
  }
});

// Remove Trade
router.delete("/:trade_id", async (req, res) => {
  try {
    const trade_id = req.params.trade_id;
    const deletedTicker = await Trade.findByIdAndDelete(trade_id);

    if (!deletedTicker) return res.sendNotFound();
    res.sendSuccess(response(true, "Trade deleted succesfully", deletedTicker));
  } catch (err) {
    console.log(err);
    res.sendInternalServerError();
  }
});

module.exports = router;
