const JOI = require("joi");

const NewTradeValidator = (tradeObj) => {
  const tradeValidateSchame = JOI.object({
    tickerSymbol: JOI.string().min(2).required(),
    avgBuyPrice: JOI.number().min(0).required(),
    shares: JOI.number().min(1).required(),
  });
  return tradeValidateSchame.validate(tradeObj);
};

const TradeUpdateBuyValidator = (objBody) => {
  const tradeBuyValidateSchame = JOI.object({
    buyPrice: JOI.number().min(0).required(),
    shares: JOI.number().min(1).required(),
  });
  return tradeBuyValidateSchame.validate(objBody);
};

const TradeUpdateSellValidator = (objBody) => {
  const tradeSellValidateSchame = JOI.object({
    shares: JOI.number().min(1).required(),
  });
  return tradeSellValidateSchame.validate(objBody);
};

module.exports = {
  TradeUpdateBuyValidator,
  TradeUpdateSellValidator,
  NewTradeValidator,
};
