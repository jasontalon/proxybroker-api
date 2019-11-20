const ping = require("../../modules/proxy/ping"),
  { inspectIp } = require("../../modules/proxy/inspect"),
  { getDuration, cleanErrorResponse } = require("../..//helpers"),
  moment = require("moment"),
  _ = require("lodash");

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

async function pingThenInspectIp(proxy) {
  const startTime = moment(),
    pingedSites = await ping(proxy),
    ipDetails = await doInspectIp(proxy);

  const result = {
    ipDetails,
    pingedSites,
    requestDuration: getDuration(startTime),
    findings: { ...evaluateInspection(ipDetails, pingedSites) }
  };

  return result;
}

function evaluateInspection(ipDetails, pingedSites) {
  const pingedSitesTitles = _.map(pingedSites, "title").join("||"),
    blockedByCloudflare = /(access denied|attention required)/gim.test(
      pingedSitesTitles
    ),
    errors = [ipDetails.error, ..._.map(pingedSites, "error")].filter(p => p);

  return { errors, blockedByCloudflare };
}
module.exports = {
  pingThenInspectIp
};
