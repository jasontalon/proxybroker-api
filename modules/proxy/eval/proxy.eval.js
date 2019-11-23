const axios = require("axios"),
  { BROWSERLESS_ENDPOINT, BROWSERLESS_TOKEN } = process.env;

async function browserlessFunction({ code, context = {}, proxy = "" }) {
  let queryString = `?--no-sandbox&--disable-setuid-sandbox&--lang=en`;
  if (proxy) queryString += "&--proxy-server=" + proxy;
  if (BROWSERLESS_TOKEN) queryString += "&token=" + BROWSERLESS_TOKEN;
  
  const url = BROWSERLESS_ENDPOINT + "/function" + queryString;

  const { data } = await axios.post(url, {
    code,
    context
  });
  return data;
}

module.exports = function(proxy) {
  return {
    ip: async function() {
      const code =
        'module.exports=async({page,context})=>{const{timeout=5000}=context;page.setDefaultTimeout(timeout);await page.setViewport({width:1366,height:768});await page.goto("https://ipstack.com/");let response=await page.waitForResponse(response=>response.url().includes("https://ipstack.com/ipstack_api.php"));const data=await response.json();return{data,type:"application/json"}}';

      const data = await browserlessFunction({ code, proxy });

      return data;
    },

    page: async function({ url, timeout, width, height, isMobile, waitUntil }) {
      const context = {
          url,
          timeout,
          width,
          height,
          isMobile,
          waitUntil
        },
        code =
          'module.exports=async({page,context})=>{const{timeout=5000,width=1366,height=768,isMobile=!1,url="",waitUntil="load"}=context;page.setDefaultTimeout(timeout);await page.setViewport({width,height,isMobile});await page.goto(url,{waitUntil});const data={title: await page.title(),body : await page.$eval("body",el=>el.innerText)};return{data,type:"application/json"}}';

      const data = await browserlessFunction({ code, context, proxy });

      return data;
    }
  };
};
