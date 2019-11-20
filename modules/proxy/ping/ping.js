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
    res({ pingDuration: getDuration(startTime), hostName, ...data });
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
const pingSites = async (proxy) => {
  const sites = [
    "https://www.duckduckgo.com/",
    "https://www.opendns.com/",
    "https://www.facebook.com/",
    "https://www.godaddy.com/",
    "https://www.namecheap.com/",
    "https://whatismyipaddress.com/blacklist-check"
  ];
  const promises = [];

  /*if (siteCount) {
    const randomNumbers = getRandomUniqueNumbers(siteCount, sites.length);

    [...new Array(siteCount)].forEach(createRandomPingPromise, {
      promises,
      proxy,
      sites,
      randomNumbers
    });
  }*/

  promises.push(
    pingSitePromise("https://whatismyipaddress.com/blacklist-check")
  );
  promises.push(pingSitePromise("https://www.socialblade.com/"));

  const results = await Promise.all(promises);

  return { ...results };
};

module.exports = pingSites;
