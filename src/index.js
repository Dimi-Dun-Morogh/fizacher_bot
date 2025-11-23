import bot from "./bot/bot.js";
import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());


// Your public HTTPS URL (for example from Render, Vercel, Fly.io, Cloudflare)
const WEBHOOK_URL = process.env.WEBHOOK_URL + "/webhook/" + bot.secretPathComponent();

// Register webhook with Telegram
await bot.telegram.setWebhook(WEBHOOK_URL);

// Pass updates to Telegraf
app.use(bot.webhookCallback("/webhook/" + bot.secretPathComponent()));

// (Optional) root route
app.get("/", (req, res) => {
  res.send("Bot is running via webhook!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
  console.log("Webhook URL:", WEBHOOK_URL);
});



// bot.launch();




// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))