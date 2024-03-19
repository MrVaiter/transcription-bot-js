const { exec } = require("child_process");

const transcribe = (modelPath, audioPath) => {

  if (!modelPath || !audioPath) {
    return
  }

  if (modelPath.slice(-1) != "/") modelPath = modelPath.concat("/");

  return new Promise((resolve, reject) => {
    exec(
      modelPath.concat("main -m ", modelPath, "models/ggml-base.bin -f ", audioPath),
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      }
    );
  });
};

export default transcribe;
