const puppeteer = require('puppeteer')

// //Scrape for crypto price
binance_coin_tracker_url = "https://api.binance.com/api/v1/ticker/24hr" //"https://api.binance.com/api/v1/ticker/24hr"

let crypto_currency_prices = 0; //[]

async function getDate(){
    let today = new Date().toLocaleDateString("en-GB", {
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

    today = today.replace(/,/g,'')
    return today
}


async function scrapePrice(ticker){
    crypto_ticker = ticker
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(binance_coin_tracker_url);
    const [element] = await page.$x('/html/body/pre');
    const context = await element.getProperty('textContent')
    let string = await context.jsonValue();
    await browser.close()
    string = string.substring(string.indexOf(crypto_ticker));
    // console.log("string: "+string)
    string = string.split("symbol")[0];
    string = string.replace(/"|,|:|{|}/g,'');
    string = string.substring(string.indexOf("lastPrice")+9);
    string = string.split("lastQty")[0];
    crypto_currency_prices = parseFloat(string);

    await Promise.reject(new Error('scrapePrice'));
}

async function getCurrentPrice(ticker) {
    await scrapePrice(ticker).catch(() => {});
    return crypto_currency_prices//.slice(-1)
}

module.exports = {scrapePrice, getCurrentPrice};