const fs = require("fs");

const appendReportFile = (fileName, message) => {
  fs.appendFile(fileName, message, (err) => {
    if (err) throw err;
    console.log("Message added successfully");
  });
};

export default appendReportFile;
