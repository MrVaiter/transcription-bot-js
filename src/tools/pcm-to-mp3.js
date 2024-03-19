const fluentFfmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const pcmToMp3 = async (pcmName) => {
  const mp3Name = pcmName.slice(0, -4) + ".mp3";

  try {
    const stats = await fs.promises.stat(pcmName);

    // check record duration
    const fileSizeInBytes = stats.size;
    const durationInSeconds = fileSizeInBytes / (48000 * 2);
    if (durationInSeconds < 2) {
      await fs.promises.unlink(pcmName);
      console.log(`Record is shorter than 2 seconds and was deleted.`);
    } else {
      // convert .pcm into .wav format
      return new Promise((resolve, reject) => {
        fluentFfmpeg(pcmName)
          .inputOptions(["-f s16le", "-ar 48k", "-ac 1"])
          .audioCodec("libmp3lame")
          .audioBitrate("128")
          .on("error", (err) => {
            console.log(`An error occurred: ${err.message}`);
            reject(err);
          })
          .save(mp3Name)
          .on("end", () => {
            console.log(`Converted ${pcmName} to ${mp3Name}`);
            fs.unlink(pcmName, (err) => {
              if (err) console.log(`Error deleting PCM file: ${err}`);
              else console.log(`${pcmName} was deleted successfully.`);
            });
            resolve(mp3Name);
          });
      });
    }
  } catch (err) {
    console.log(`An error occurred: ${err.message}`);
    throw err;
  }
};

export default pcmToMp3;
