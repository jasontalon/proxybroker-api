module.exports = {
  findProxy: require("./find"),
  ...require("./inspect"),
  pingSites: require("./ping")
};
