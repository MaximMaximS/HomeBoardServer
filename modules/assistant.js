const path = require("path");
const GoogleAssistant = require("google-assistant");
let ready = false;
const assistant = new GoogleAssistant({
  keyFilePath: path.resolve(__dirname, "ga_data/oauth.json"),
  savedTokensPath: path.resolve(__dirname, "ga_data/tokens.json"),
});
assistant.once("ready", () => {
  ready = true;
});
module.exports = {
  run(command) {
    if (!ready) {
      return new Error("Assistant not ready");
    }
    return new Promise((resolve, reject) => {
      assistant.start(
        {
          lang: "en-US", // language code for input/output (defaults to en-US)
          textQuery: command, // if this is set, audio input is ignored
          isNew: true, // set this to true if you want to force a new conversation and ignore the old state
          screen: {
            isOn: true, // set this to true if you want to output results to a screen
          },
        },
        async (conversation, err) => {
          if (err) {
            return reject(err);
          }
          conversation.end();

          await new Promise((resolve, reject) => {
            conversation.once("ended", () => {
              return resolve();
            });
            conversation.once("error", (err3) => {
              return reject(err3);
            });
          })
            .then(() => {
              resolve();
            })
            .catch((err2) => {
              reject(err2);
            });
        }
      );
    });
  },
};
