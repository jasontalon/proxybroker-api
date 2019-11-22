const axios = require("axios"),
  {
    GRAPHQL_ENDPOINT,
    GRAPHQL_ADMIN_SECRET_KEY,
    GRAPHQL_ADMIN_SECRET_VALUE
  } = process.env;

module.exports = async function(proxy) {
  const query = `mutation { insert_proxy(objects: {proxy: "${proxy}"}, on_conflict: {constraint: proxy_pkey, update_columns: proxy}) { affected_rows } }`,
    headers = { [GRAPHQL_ADMIN_SECRET_KEY]: GRAPHQL_ADMIN_SECRET_VALUE };
  const {
    data: { data: { insert_proxy: { affected_rows = 0 } = {} } = {}, errors }
  } = await axios.post(GRAPHQL_ENDPOINT, { query }, { headers });

  if (errors) throw errors;
  return affected_rows;
};
