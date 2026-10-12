require("dotenv").config();

const { setTimeout, setImmediate, setInterval } = require('node:timers/promises');
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

const availableCommands = {
    "ping": "```/obebot-ping``` Measures the latency of the Slack Bot in millseconds and responds with 'Pong!'",
    "future": "```/obebot-future``` Sends a message to the future. Enter how many seconds you want the bot to wait before sending the message, and then type your message. Can send messages up to 5 minutes!",
    "help": "```/obebot-help``` Displays a list of available commands and what they do. \nType ```/obebot-help [command name]``` if you want to look up a specific command."
};

app.command("/obebot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});
app.command("/obebot-future", async ({ command, ack, respond }) => {
  await ack();
  const splitStr = command.text.split(' ');
  const seconds = Number(splitStr[0]);
  if(Number.isNaN(seconds)) {
    await respond({ text: "You must specificy a valid number before your message!"});
    return;
  }
  if(seconds < 0) {
    await respond({ text: "Time must be greater than zero!"});
    return;
  }
  if(seconds > 300) {
    await respond({ text: "Time must be under 300 seconds (5 minutes)!"});
    return;
  }
  await setTimeout(seconds * 1000);
  const messag = splitStr.splice(1);
  await respond({ text: `${messag}`});
});
app.command("/obebot-help", async ({ command, ack, respond}) => {
  await ack();
  if(command.text == "") {
    await respond({
        text:
        `
        Available Commands:
        \`\`\`/obebot-ping\`\`\` - Check bot latency
        \`\`\`/obebot-future\`\`\` - Send a message to the (near) future
        \`\`\`/obebot-help\`\`\` - Displays a list of commands you can use. You can also type \`\`\`/obebot-help [command name]\`\`\` to look at a specific command.
        `
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