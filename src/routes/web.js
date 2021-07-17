import express from "express";
import chatBotController from "../controllers/chatBotController";

let router = express.Router();

export default function initWebRoute(app) {
  router.get("/", chatBotController.getHomePage);
  router.get("/webhook", chatBotController.getWebhook);
  router.post("/webhook", chatBotController.postWebhook);
  return app.use("/", router);
}
