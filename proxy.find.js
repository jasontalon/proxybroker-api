const { exec } = require("child_process"),
  path = require("path"),
  proxyBrokerDirectory = process.env.PROXYBROKER_DIRECTORY || "";

function extractIpAndPort(output) {
  return (
    output.match(
      /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+/gm
    ) || []
  ).pop();
}

function splitIpAndPort(ipPort) {
  const regex = new RegExp(/(?::[0-9]+)$/gm),
    ip = ipPort.replace(regex, ""),
    port =
      ((ipPort.match(regex) || []).pop() || "").replace(/:/gm, "") || undefined;
  return port ? { ip, port } : { ip };
}

const parseProxyBrokerResponseItem = row => ({
    ...splitIpAndPort(extractIpAndPort(row)),
    summary: row.replace(/(\r|<|Proxy |>|\d{1,2}.\d{1,2}s )/gm, "")
  }),
  buildCommand = (proxyBrokerDirectory, countries, limit) =>
    `${path.join(
      proxyBrokerDirectory,
      "proxybroker"
    )} find --types HTTPS --lvl High --countries ${countries} --strict -l ${limit}`;

function parseProxyBrokerResponseItems(item) {
  this.push(parseProxyBrokerResponseItem(item));
}

function proxyBrokerResponse({ error, stdout, stderr }, { resolve, reject }) {
  if (error || stderr) reject({ error, stderr });
  else {
    const proxies = [],
      proxyBrokerResponseItems = stdout.split("\n").filter(p => p);

    proxyBrokerResponseItems.forEach(parseProxyBrokerResponseItems, proxies);

    resolve(proxies);
  }
}

async function findProxy({ countries = "US", limit = 15 }) {
  return new Promise((resolve, reject) => {
    exec(
      buildCommand(proxyBrokerDirectory, countries, limit),
      (error, stdout, stderr) =>
        proxyBrokerResponse({ error, stdout, stderr }, { resolve, reject })
    );
  });
}

module.exports = { findProxy };
