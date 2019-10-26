const axios = require("axios"),
	util = require("util"),
	endpoint = process.env.GRAPHQL_ENDPOINT,
	headers = {
		[process.env.GRAPHQL_SECRET_KEY]: process.env.GRAPHQL_SECRET_VALUE || ""
	};

module.exports = {
	saveProxyIp: async proxies => {
		const proxyStringifiedArray = util.inspect(proxies).replace(/'/gm, '"'),
			query = `mutation { insert_proxy(objects: ${proxyStringifiedArray}, 
			on_conflict: {constraint: proxy_pkey, update_columns: ip}) { affected_rows } }`,
			{
				data: {
					data: { insert_proxy: { affected_rows = 0 } = {} } = {},
					errors
				}
			} = await axios.post(endpoint, { query }, { headers });
		if (errors) throw errors.pop();
		return affected_rows;
	},

	fetchProxyIp: async () => {
		const query = "query { proxy(limit: 10, order_by: {updated_at: desc}) { ip port, type, updated_at } }",
			{
				data: { data: { proxy = [] } = {}, errors }
			} = await axios.post(endpoint, { query }, { headers });
		if (errors) throw errors.pop();
		return proxy;
	}
};
