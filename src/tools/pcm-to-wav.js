const fluentFfmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const pcmToWav = async (pcmName) => {
  const wavName = pcmName.slice(0, -4) + ".wav";

  try {
    const stats = await fs.promises.stat(pcmName);

    // check record duration
    const fileSizeInBytes = stats.size;
    const durationInSeconds = fileSizeInBytes / (48000 * 2);
    if (durationInSeconds < 2) {
      // await fs.promises.unlink(pcmName);
      console.log(`Record ${pcmName} is shorter than 2 seconds and was deleted.`);
      return
    } else {
      // convert .pcm into .wav format
      return new Promise((resolve, reject) => {
        fluentFfmpeg(pcmName)
          .inputOptions(["-f s16le", "-ar 48k", "-ac 1"])
          .audioFilters("aresample=16000")
          .audioCodec("pcm_s16le")
          .on("error", (err) => {
            console.log(`An error with converting occurred: ${err.message}`);
            reject(err);
          })
          .save(wavName)
          .on("end", () => {
            console.log(`Converted ${pcmName} to ${wavName}`);

            console.log(`${pcmName} deleted`);
            // fs.promises
            //   .unlink(pcmName)
            //   .then(console.log(`${pcmName} was deleted successfully.`))
            //   .catch((err) => console.log(`Error deleting PCM file: ${err}`));
            resolve(wavName);
          });
      });
    }
  } catch (err) {
    console.log(`An error occurred: ${err.message}`);
    throw err;
  }
};

export default pcmToWav;
