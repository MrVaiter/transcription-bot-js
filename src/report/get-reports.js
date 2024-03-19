const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");

const getReports = (message) => {
  let buttons = [];

  getAllReportFiles().then((reports) => {
    for (let report of reports) {
      buttons.push(
        new ButtonBuilder()
          .setCustomId(report)
          .setLabel(report)
          .setStyle(ButtonStyle.Secondary)
      );
    }

    const row = new ActionRowBuilder().addComponents(...buttons);

    message.reply({ content: "Available reports", components: [row] });
  });
};

const getAllReportFiles = () => {
  return new Promise((resolve, reject) => {
    fs.readdir("./reports", (err, reports) => {
      if (err) {
        reject("Error: " + err);
      } else {
        resolve(reports);
      }
    });
  });
};

export default getReports;
