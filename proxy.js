const { exec } = require("child_process"),
	path = require("path"),
	proxyBrokerDirectory = process.env.PROXYBROKER_DIRECTORY;

const extractIpAddress = output => (output.match(/(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+/gm) || []).pop(),
 splitIpAndPort = ipPort => {
	const regex = new RegExp(/(?::[0-9]+)$/gm),
		ip = ipPort.replace(regex, ""),
		port = ((ipPort.match(regex) || []).pop() || "").replace(/:/gm, "") || undefined;
	return port ? { ip, port } : { ip };
},
 parseProxyElement = element => ({
	type: element.includes("HTTPS") ? "HTTPS" : "HTTP",
	...splitIpAndPort(extractIpAddress(element))
}),
 proxyBrokerResponse = ({ error, stdout, stderr },{ resolve, reject }) => {
	if (error) reject(error);
	else if (stderr) reject(stderr);
	else {
		const proxies = [];
		stdout
			.split("\n")
			.filter(p => p)
			.forEach(element => proxies.push(parseProxyElement(element)));
		resolve(proxies);
	}
};

module.exports = {
	filterProxyIp: async (countries = "US", limit = 10) => {
		return new Promise((resolve, reject) => {
			if (!proxyBrokerDirectory) throw "PROXYBROKER_DIRECTORY not specified.";
			exec(`${path.join(proxyBrokerDirectory,"proxybroker")} find --types HTTP HTTPS --countries ${countries} -l ${limit}`,
				(error, stdout, stderr) =>
					proxyBrokerResponse(
						{ error, stdout, stderr },
						{ resolve, reject }
					)
			);
		});
	}
};