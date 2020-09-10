const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const serverResponseHandler = require("./middleware/serverResponseHandler");
const contentTypeHandler = require("./middleware/contentTypeHandler");

const Trades = require("./routes/trade/trade");
const Portfolio = require("./routes/portfolio/portfolio");
require("dotenv").config();
require("./dependencies");

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0-uegxx.mongodb.net/test?retryWrites=true&w=majority`,
    {
      dbName: "PortfolioTracking",
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Conncected to database"))
  .catch((err) => console.log(err));

// mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0-uegxx.mongodb.net/test?retryWrites=true&w=majority`, {dbName:'WeBase',useNewUrlParser: true})
//     .then(res => console.log('Connected to datatbase'))
//     .catch(err => console.log(err))

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custome middleware
app.use(contentTypeHandler());
app.use(serverResponseHandler());

//Routes
app.use("/trade", Trades);
app.use("/portfolio", Portfolio);

app.get("/", (req, res) => {
  res.send("Hello world");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
