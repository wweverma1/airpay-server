axios = require('axios');

async function getTokenPrice(token, fiat) {
    const options = {
        method: 'GET',
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=${fiat}`,
        headers: {'Content-Type': 'application/json'}
    }

    return axios.request(options).then(function(response) {
        // console.log(response.data.aptos.usd);
        price = response.data.aptos.usd;
        return price;
    }).catch(function(error) {
        console.log(error);
        return new Error("Coingecko API failed.");
    });
}

// (async() => {
//     token_price = await getTokenPrice('aptos', 'usd');
//     console.log(token_price);
// })();

module.exports = {getTokenPrice};