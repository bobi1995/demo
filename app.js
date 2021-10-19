const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");
const isAuth = require("./middleware/Auth");
const dotenv = require("dotenv");
dotenv.config();

const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@demo-shard-00-00.s5bfb.mongodb.net:27017,demo-shard-00-01.s5bfb.mongodb.net:27017,demo-shard-00-02.s5bfb.mongodb.net:27017/${process.env.MONGO_DB}?ssl=true&replicaSet=atlas-y5tgea-shard-0&authSource=admin&retryWrites=true&w=majority`;

const app = express();

app.use(isAuth);
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  return next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.get("/", (req, res) => res.send("This is LUMINEXYS API!"));

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(4000, () => {
      console.log(process.env.MONGO_DB);
      console.log("listening");
    });
  })
  .catch((err) => {
    console.log(process.env.MONGO_DB);
    console.log(err);
  });
