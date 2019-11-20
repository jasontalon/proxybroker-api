const axios = require("axios"),
  { BROWSERLESS_ENDPOINT } = process.env;

async function browserlessFunction({ code, context = {}, proxy = "" }) {
  let queryString = `?--no-sandbox&--disable-setuid-sandbox&--lang=en`;
  if (proxy) queryString += "&--proxy-server=" + proxy;
  const url = BROWSERLESS_ENDPOINT + "/function" + queryString;

  const { data } = await axios.post(url, {
    code,
    context
  });
  return data;
}

module.exports = {
  inspectIp: async function(proxy) {
    const code =
      'module.exports=async({page,context})=>{const{timeout=30000}=context;page.setDefaultTimeout(timeout);await page.setViewport({width:1366,height:768});await page.goto("https://ipstack.com/");let response=await page.waitForResponse(response=>response.url().includes("https://ipstack.com/ipstack_api.php"));const data=await response.json();return{data,type:"application/json"}}';

    const data = await browserlessFunction({ code, proxy });

    return data;
  },

  inspectPage: async function(proxy, context) {
    const code =
      'module.exports=async({page,context})=>{const{timeout=30000,width=1366,height=768,isMobile=!1,targetSite="",waitUntil="load"}=context;page.setDefaultTimeout(timeout);await page.setViewport({width,height,isMobile});await page.goto(targetSite,{waitUntil});const data={title: await page.title(),body : await page.$eval("body",el=>el.innerText)};return{data,type:"application/json"}}';

    const data = await browserlessFunction({ proxy, code, context });

    return data;
  }
};
