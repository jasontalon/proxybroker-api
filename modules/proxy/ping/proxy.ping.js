const moment = require("moment"),
  evaluate = require("../eval"),
  { cleanErrorResponse, getDuration } = require("../../../util");

async function pingSite(proxy, url, resolve) {
  const startTime = moment();

  try {
    const data = await evaluate(proxy).page({ url });
    resolve({ duration: getDuration(startTime), url, ...data });
  } catch (error) {
    resolve({
      url,
      duration: getDuration(startTime),
      error: cleanErrorResponse(error)
    });
  }
}

function ping(url) {
  return new Promise(async resolve => {
    await pingSite(this.proxy, url, resolve);
  });
}

const pingSites = async ({ proxy = "", urls = [] }) => {
  const results = await Promise.all(urls.map(ping, { proxy }));
  return results;
};

module.exports = pingSites;
