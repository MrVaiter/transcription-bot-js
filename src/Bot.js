import { Client, IntentsBitField } from "discord.js";
import listenChannel from "./commands/listen";
import joinChannel from "./commands/join";
import getMembers from "./commands/get-members";
import getReports from "./report/get-reports";
const fs = require("fs");

require("dotenv").config();

const botToken = process.env.BOT_TOKEN;
const PREFIX = "!";

export default class Bot {
  constructor() {
    this.client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildVoiceStates,
      ],
    });

    this.client.on("ready", async () => {
      console.log("Bot is ready!");
    });
    this.client.login(botToken);

    this.client.on("messageCreate", async (msg) => {
      const content = trimMessage(msg.content);

      // Command syntax check
      if (content.indexOf(PREFIX) != 0) {
        return;
      }

      switch (content) {
        case "!hello":
          msg.reply("Hello, <@" + msg.author.id + ">");
          break;

        // Join voice channel
        case "!join":
          this.connection = joinChannel(msg);
          if (this.connection) {
            msg.reply("Bot successfully joined the channel");
            console.log(
              `Voice channel "${msg.member.voice.channel.name}" users:`
            );
            getMembers(msg, this.client).forEach((user) =>
              console.log("->" + user[1])
            );
            console.log("\n");
          } else {
            console.log("Something went wrong");
          }
          break;

        // Exit voice channel
        case "!reset":
          if (this.connection) {
            this.connection.destroy();
            msg.reply("Bot reseted successfully");
          } else {
            msg.reply("I'm not in voice channel!");
          }
          break;

        // Enable listener
        case "!listen":
          msg.reply("Bot started listening");
          listenChannel(this.connection, msg, this.client);
          break;

        case "!get-reports":
          getReports(msg);
          break;

        default:
          msg.reply("Unknown command!");
      }
    });

    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;
      const filePath = "./reports/" + interaction.customId;

      if (fs.existsSync(filePath)) {
        try {
          await interaction.channel.send({ files: [filePath] });
        } catch (error) {
          console.error(`Error sending file: ${error}`);
        }
      } else {
        console.log(`File not found: ${filePath}`);
      }
    });
  }
}

// Trim unnecessary parts of message
const trimMessage = (str) => {
  const startPosition = str.indexOf("> ") + 2;
  const content = str.slice(startPosition);
  return content.trim();
};
