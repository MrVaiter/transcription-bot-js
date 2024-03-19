import getMembers from "../commands/get-members"

const fs = require("fs");

const createReportFile = (message, client) => {
  const members = getMembers(message, client);
  let content = `Voice channel "${message.member.voice.channel.name}" users:\n`
  const fileName = "./reports/" + formFileName(message);

  for(let member of members) {
    content += "-> " + member[1] + "\n"
  }

  content += "\n"

  fs.writeFile(fileName, content, (err) => {
    if (err) throw err;
    console.log("File \"" + fileName + "\" created successfully!");
  });

  return fileName
};

const formFileName = (message) => {
  const channelName = message.member.voice.channel.name;

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  return `Report_${channelName}_${today.getHours()}:${today.getMinutes()}.txt`;
};

export default createReportFile;
