import express from "express";
import viewEngine from "./config/viewEngine.js";
import initWebRoute from "./routes/web.js";
import bodyParser from "body-parser";
require("dotenv").config();

let app = express();

//config view engine
viewEngine(app);

//parser request to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//init web route
initWebRoute(app);

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("chatbot is running at port: " + port);
});
