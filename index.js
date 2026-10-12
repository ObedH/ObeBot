require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

const availableCommands = {
    "ping": "/obebot-ping Measures the latency of the Slack Bot in millseconds and responds with 'Pong!'"
};

app.command("/obebot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});
app.command("/obebot-help", async ({ command, ack, respond}) => {
  await ack();
  if(command.text == "") {
    await respond({
        text:
        `Available Commands:
        /obebot-ping - Check bot latency`
    });
  }
  else {
    await respond({
        text: availableCommands[command.text]
    });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();