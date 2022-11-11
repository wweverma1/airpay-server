// const {scrapePrice, getCurrentPrice} = require("./priceScraper.js");
const {getTokenPrice} = require("./priceApi.js");

async function FiatToSubcoin(amount, token_ticker, fiat_ticker, sub_coin_ratio = 1){
    if (amount < 0) {
        throw "amount must not be negative";
    }
    fiat_exchange_rate_price = await getTokenPrice(token_ticker, fiat_ticker);
    return Math.ceil(amount   *  (sub_coin_ratio/fiat_exchange_rate_price) );
}

async function FiatToCoin(amount, token_ticker, fiat_ticker, sub_coin_ratio = 1){
    if (amount < 0) {
        throw "amount must not be negative";
    }
    fiat_exchange_rate_price = await getTokenPrice(token_ticker, fiat_ticker);
    return Math.ceil(amount   *  (sub_coin_ratio/fiat_exchange_rate_price))/sub_coin_ratio;
}

async function SubcoinToFiat(amount, token_ticker, fiat_ticker, sub_coin_ratio = 1){
    if (amount < 0) {
        throw new Error("Amount must not be negative");
    }
    // fiat_exchange_rate_price = await getCurrentPrice(ticker);
    fiat_exchange_rate_price = await getTokenPrice(token_ticker, fiat_ticker);

    // console.log("SubcoinToFiat: "+(amount  * (fiat_exchange_rate_price /sub_coin_ratio)))
    // console.log("fiat_exchange_rate_price: "+fiat_exchange_rate_price)

    return (amount  * (fiat_exchange_rate_price /sub_coin_ratio)).toFixed(2);
}

async function CoinToFiat(amount, token_ticker, fiat_ticker, sub_coin_ratio = 1){
    if (amount < 0) {
        throw "amount must not be negative"
    }
    fiat_exchange_rate_price = await getTokenPrice(token_ticker, fiat_ticker);
    return (amount   *  fiat_exchange_rate_price.toFixed(2));
}

module.exports = { FiatToSubcoin, FiatToCoin, SubcoinToFiat, CoinToFiat};