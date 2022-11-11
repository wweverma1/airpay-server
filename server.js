const port = 3002;

// Server imports
const express = require('express');
const cors = require('cors');
const app = express().use('*', cors());
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(express.json());
app.use(jsonParser);
var axios = require("axios").default;

// Aptos Imports
const aptos = require('aptos');
const aptosWeb3 = require('@martiandao/aptos-web3-bip44.js');
const { bcsSerializeUint64 } = require('@martiandao/aptos-web3-bip44.js/dist/bcs');
const NODE_URL = "https://fullnode.testnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
const walletClient = new aptosWeb3.WalletClient(NODE_URL, FAUCET_URL);
const client = new aptosWeb3.AptosClient(NODE_URL);

// Conversion imports
const fiatAptosConversion = require('./price_conversion/fiatAptosConversion');


// ------ Constants ------
const ACCEPT = 200;
const REJECT = 402;
const ACCOUNT_PRIVATE_KEY = '0x5ef3664d7687b26acc5a4ba76291f993b23956e2d819fe6439640cbb0b37c4f5';
// ------ Constants ------


// ------ Helper functions ------
async function getMartianAccountsAptosAmount(mnemonic) {
    console.log("\n=== Wallet Login ===");
    console.log(mnemonic);

    try {
        const walletAccount = await aptosWeb3.WalletClient.getAccountFromMnemonic(mnemonic);
        const address = walletAccount.address().hexString;
        const token_balance = await walletClient.getBalance(address);
        return {address, token_balance};
    } catch (error) {
        return error;
    }
}

async function runAptosBlockchainTransaction(transaction_amount, ACCOUNT_PRIVATE_KEY){
    const client = new aptos.AptosClient(NODE_URL);
    const sender = new aptos.AptosAccount(aptos.HexString.ensure(ACCOUNT_PRIVATE_KEY).toUint8Array());

    const payload = new aptos.TxnBuilderTypes.TransactionPayloadEntryFunction(
        aptos.TxnBuilderTypes.EntryFunction.natural(
            "0x7899cc9c5b8ef15605ef46adc52d004db3caa5e4b2bb64da46cb7b9363f8e934::router", // Address and module/script name
            "deposit_to_vault", // Function
            [], // Argument types (optional?)
            [bcsSerializeUint64(100000)] // Arguments
        )
    );

    console.log("Built payload");

    const raw = await client.generateRawTransaction(sender.address(), payload);

    console.log("Built raw transaction");

    const signed = aptos.AptosClient.generateBCSTransaction(sender, raw);

    console.log("Built signed transaction " + signed);

    const response = await client.submitSignedBCSTransaction(signed);

    console.log(`Response: ${response.body}`);

    // May not be needed?
    await client.waitForTransaction(response.hash);
}
// ------ Helper functions ------


// ------ Endpoints ------
app.get('/', (req, res) => {
    console.log(req.body.first_name);
    res.status(200).send('Root endpoint was hit.');
});

app.post('/getAccountResources', async (req, res) => {

    if (!req.body.mnemonic) {
        res.statusMessage = "Invalid mnemonic";
        return res.status(400).end();
    }

    const {address, token_balance} = await getMartianAccountsAptosAmount('genius useless salmon emotion quantum pony adult hunt firm suspect physical copper'); // hard-coding for now, instead of req.body.mnemonic

    if(!address && !token_balance) {
        res.statusMessage = "Account details undefined";
        return res.status(400).end();
    }

    token_balance_in_usd = await fiatAptosConversion.OctasToFiat(token_balance);

    const json_response = {
        "address": address,
        "token_balance": token_balance_in_usd,
        "nft_balance": '0' // hard-coding for now
    }
    
    return res.status(200).json(json_response);

});

app.get('/getCards', async (req, res) => {

    const json_response = [
        {
            "id": "1",
            "cardholder_name": "David Cholariia",
            "card_number": "1234123412345168",
            "cvc": "534",
            "expiration_date": "0624"
        },
        {
            "id": "2",
            "cardholder_name": "David Cholariia",
            "card_number": "1234123412341241",
            "cvc": "497",
            "expiration_date": "0727"
        }
    ]
    
    return res.status(200).json(json_response);
});

app.post("/airpayTransaction", async (req, res) => {

    const data = req.body;
    console.log(data);
    
    await runAptosBlockchainTransaction(100000, ACCOUNT_PRIVATE_KEY);

    const json_response = {
        "category": "Purchase",
        "vendor": "Starbucks",
        "amount_paid_usd": "10.67",
        "swap_price_impact": "0.1",
        "fees": "0.3"
    };

    console.log(json_response);
    res.status(200).send(json_response);
});
// ------ Endpoints ------


app.listen(process.env.PORT || port, () => console.log(`Express app listening at http::/localhost:${port}`));