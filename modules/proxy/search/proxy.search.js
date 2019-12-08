const { exec } = require("child_process"),
  path = require("path");

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
  buildCommand = (countries, limit) => {
    let countryParameter = "";
    if (countries) countryParameter = `--countries ${countries}`;
    return `${path.join(
      "proxybroker"
    )} find --types HTTPS --lvl High ${countryParameter} --strict -l ${limit}`;
  };

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

async function findProxy({ countries, limit = 10 }) {
  return new Promise((resolve, reject) => {
    exec(
      buildCommand(countries, limit),
      (error, stdout, stderr) =>
        proxyBrokerResponse({ error, stdout, stderr }, { resolve, reject })
    );
  });
}

module.exports = findProxy;
