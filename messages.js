const moment = require("moment");

const formatMessage = (username, text) => {
  return {
    username,
    text,
    time: moment().format("MMM Do, h:mm:ss a"),
  };
};

module.exports = formatMessage;
