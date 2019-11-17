const ping = require("../../modules/proxy/ping"),
  { inspectIp } = require("../../modules/proxy/inspect"),
  { getDuration, cleanErrorResponse } = require("../..//helpers"),
  moment = require("moment");

async function doInspectIp(proxy) {
  try {
    const startTime = moment(),
      details = await inspectIp(proxy);
    const inspectDuration = getDuration(startTime);
    return { inspectDuration, details };
  } catch (error) {
    return { error: cleanErrorResponse(error) };
  }
}

async function pingThenInspectIp({ proxy, siteCount }) {
  const startTime = moment(),
    pingedSites = await ping({ proxy, siteCount }),
    ipDetails = await doInspectIp(proxy);

  const result = {
    ipDetails,
    pingedSites,
    requestDuration: getDuration(startTime)
  };

  return result;
}

module.exports = {
  pingThenInspectIp
};
