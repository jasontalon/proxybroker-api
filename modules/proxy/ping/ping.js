const moment = require("moment"),
  { inspectPage } = require("../inspect"),
  {
    cleanErrorResponse,
    getDuration,
    getRandomUniqueNumbers
  } = require("../../../helpers");

async function pingSite(targetSite, res) {
  const hostName = new URL(targetSite).hostname;
  const startTime = moment();
  try {
    const data = await inspectPage(this.proxy, {
      targetSite,
      isMobile: true,
      width: 750,
      height: 1334
    });
    res({ pingDuration: getDuration(startTime), hostName, data });
  } catch (error) {
    res({
      pingDuration: getDuration(startTime),
      hostName,
      error: cleanErrorResponse(error)
    });
  }
}
async function pingSitePromise(targetSite) {
  return new Promise(async res => {
    await pingSite(targetSite, res);
  });
}
function createRandomPingPromise(value, index) {
  const promise = new Promise(async res => {
    const targetSite = this.sites[this.randomNumbers[index]];
    await pingSite(targetSite, res);
  });

  this.promises.push(promise);
}
const pingSites = async ({ proxy, siteCount = 3 }) => {
  const sites = [
    "https://www.opendns.com/",
    "https://www.google.com/",
    "https://www.facebook.com/",
    "https://www.godaddy.com/",
    "https://www.namecheap.com/",
    "https://www.socialblade.com/"
  ];

  const randomNumbers = getRandomUniqueNumbers(siteCount, sites.length);
  const promises = [];

  [...new Array(siteCount)].forEach(createRandomPingPromise, {
    promises,
    proxy,
    sites,
    randomNumbers
  });

  promises.push(pingSitePromise("https://www.cloudflare.com/"));//check proxy if it is blocked by cloudflare

  const results = await Promise.all(promises);

  return { ...results };
};

module.exports = pingSites;
