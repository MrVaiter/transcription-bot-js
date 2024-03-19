import transcribe from "../tools/transcribe";
import pcmToWav from "../tools/pcm-to-wav";
import createReportFile from "../report/create-report-file";
import appendReportFile from "../report/append-report-file";

const { EndBehaviorType } = require("@discordjs/voice");
const prism = require("prism-media");
const fs = require("fs");
require("dotenv").config();

const modelPath = process.env.MODEL_PATH;

// record voice activity
const listenChannel = (connection, message, client) => {
  if (connection) {
    const receiver = connection.receiver;
    const fileName = createReportFile(message, client);

    receiver.speaking.on("start", (userID) => {
      const user = client.users.cache.get(userID);
      const username = user ? user.username : "unknown";

      const audioStream = receiver.subscribe(userID, {
        end: {
          behavior: EndBehaviorType.AfterSilence,
          duration: 1000,
        },
      });

      const outputStream = new prism.opus.Decoder({
        channels: 1,
        rate: 48000,
        frameSize: 960,
      });

      const stamp = formStamp();
      const pcmName = "./records/" + username + "_" + stamp + ".pcm";
      const writeStream = fs.createWriteStream(pcmName);

      new Promise((resolve) => {
        audioStream
          .pipe(outputStream)
          .pipe(writeStream)
          .on("finish", () => {
            resolve();
          });
      })
        .then(() => {
          console.log("\n");
          return pcmToWav(pcmName);
        })
        .then((wavName) => {
          console.log("\n");
          if(wavName){
            return transcribe(modelPath, wavName);
          }
        })
        .then((stdout) => {
          if(stdout) {
            appendReportFile(fileName, formMessage(stdout, username, stamp) + "\n")
          }
        });
    });
  } else {
    message.reply("Please, connect to voice channel");
  }
};

const formStamp = () => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  let dateStamp =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  let timeStamp =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  return dateStamp + "_" + timeStamp;
};

const formMessage = (msg, username, stamp) => {
  const time = stamp.slice(stamp.indexOf("_") + 1);

  const message = msg.trim();
  const lines = message.split("\n");
  let content = "-";

  for (let line of lines) {
    let startPosition = line.indexOf("] ") + 3;
    content += line.slice(startPosition);
  }

  return `${username} (${time})\n${content}\n`;
};

export default listenChannel;
