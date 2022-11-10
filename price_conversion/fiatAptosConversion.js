const priceConversion = require("./fiatCryptoConversion.js");

const OCTAS_APTOS_RATIO = 100000000 // Should be an env variable
const APTOS_TICKER = 'APT'

async function FiatToAPT(amount, fiat_ticker = 'USD'){  
    currency_ticker = APTOS_TICKER + fiat_ticker.toUpperCase()
    return priceConversion.FiatToCoin(amount = amount, ticket = currency_ticker, sub_coin_ratio = OCTAS_APTOS_RATIO)
}

async function FiatToOctas(amount, fiat_ticker = 'USD'){   
    currency_ticker = APTOS_TICKER+fiat_ticker.toUpperCase()
    return priceConversion.FiatToSubcoin(amount = amount, ticket = currency_ticker, sub_coin_ratio = OCTAS_APTOS_RATIO)
}


async function APTToFiat(amount, fiat_ticker = 'USD'){   
    currency_ticker = APTOS_TICKER + fiat_ticker.toUpperCase()
    return priceConversion.CoinToFiat(amount = amount, ticket = currency_ticker, sub_coin_ratio = OCTAS_APTOS_RATIO)
}

async function OctasToFiat(amount, fiat_ticker = 'USD'){   
    currency_ticker = APTOS_TICKER + fiat_ticker.toUpperCase()
    return priceConversion.SubcoinToFiat(amount = amount, ticket = currency_ticker, sub_coin_ratio = OCTAS_APTOS_RATIO)
}


// async function main(){
//     price = await FiatToOctas(10, 'BRL')
//     console.log(price)
//     price = await FiatToOctas(10, 'USD')
//     console.log(price)
// }
// main();

module.exports = { FiatToAPT, FiatToOctas, APTToFiat, OctasToFiat};