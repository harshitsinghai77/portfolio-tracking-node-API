const router = require("express").Router();
const Trade = require("../../models/trade");
const { response } = require("../../utils/util");

// Fetching holdings - It is an aggregate view of all securities in the portfolio with its final
// quantity and average buy price.
router.get("/holdings", async (req, res) => {
  try {
    //https://stackoverflow.com/questions/17044587/how-to-aggregate-sum-in-mongodb-to-get-a-total-count
    const totalAggregate = await Trade.aggregate([
      {
        $group: {
          _id: null,
          total_share_quantity: { $sum: "$shares" },
          total_average_buy_price: { $sum: "$avgBuyPrice" },
        },
      },
    ]);
    res.sendSuccess(
      response(
        true,
        "Aggregate view of all securities in the portfolio",
        totalAggregate
      )
    );
  } catch (err) {
    console.log(err);
    res.sendInternalServerError();
  }
});

// Calculating cumulative returns of portfolio.
router.get("/cumulative_returns", async (req, res) => {
  try {
    const trades = await Trade.find({});
    const currentPrice = 100;
    let cumulativeReturns = 0;

    for (let i = 0; i < trades.length; i++) {
      cumulativeReturns +=
        (currentPrice - trades[i].avgBuyPrice) * trades[i].shares;
    }
    res.sendSuccess(
      response(
        true,
        `cumulative returns: ${cumulativeReturns}`,
        cumulativeReturns
      )
    );
  } catch (err) {
    console.log(err);
    res.sendInternalServerError();
  }
});

module.exports = router;
