const port = 3001;

// Server imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { stringify } = require('querystring');
const jsonParser = bodyParser.json();
app.use(express.json());
app.use(jsonParser);
var axios = require("axios").default;
const cors = require('cors');
app.use(cors());

// Aptos Imports
const aptosWeb3 = require('@martiandao/aptos-web3-bip44.js');
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
const walletClient = new aptosWeb3.WalletClient(NODE_URL, FAUCET_URL);
const client = new aptosWeb3.AptosClient(NODE_URL);

// ------ Constants ------
const ACCEPT = 200;
const REJECT = 402;
// ------ Constants ------

// ------ Helper functions ------
async function getMartianAccountsAptosAmount(mnemonic) {
    console.log("\n=== Wallet Login ===");
    const walletAccount = await aptosWeb3.WalletClient.getAccountFromMnemonic(mnemonic);

    const address = walletAccount.address().toString();
    const balance = await walletClient.getBalance(address);

    console.log('Address:', address);
    console.log('walletAccount: ', JSON.stringify(walletAccount));
    console.log('Balance:', await walletClient.getBalance(address));

    return [address, balance];
}

async function aptosBlockchainTransaction(user_address, public_key, signature, transaction_amount){

    // estimate_gas_price = estimateGasPrice()
    // estimated_total_transaction_amount = transaction_amount + estimate_gas_price

    gas_amount = 10

    var options = {
        method: 'POST',
        url: 'https://fullnode.devnet.aptoslabs.com/v1/transactions',
        headers: {'Content-Type': 'application/json'},
        data: {
          sender: user_address,

          // What should these 4 be?
          sequence_number: '32425224034', // see getAccount on rpc docs
          max_gas_amount: stringify(gas_amount),
          gas_unit_price: stringify(gas_amount),
          expiration_timestamp_secs: '32425224034',

          // Change function to correct move module
          payload: {
            type: 'entry_function_payload',
            function: '0x1::aptos_coin::transfer',

            // what types can be put in?
            type_arguments: ['string'],
            arguments: [transaction_amount, gas_amount]
          },

          // How to get a users signature
          signature: {
            type: 'ed25519_signature',
            public_key: public_key,
            signature: '0x88fbd33f54e1126269769780feb24480428179f552e2313fbe571b72e62a1ca1'
          }
        }
    };

    response_status = REJECT
    axios.request(options).then(function (response) {
        response_status = ACCEPT;
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });

    return response_status;
}

// async function estimateGasPrice(){
//     estimate_gas_price = 0

//     var options = {
//         method: 'GET',
//         url: 'https://fullnode.devnet.aptoslabs.com/v1/estimate_gas_price',
//         headers: {'Content-Type': 'application/json'}
//       };

//       axios.request(options).then(function (response) {
//         estimate_gas_price = response.data.gas_estimate

//         console.log(response.data.gas_estimate);
//       }).catch(function (error) {
//         console.error(error);
//       });

//       return estimate_gas_price
// }
// ------ Helper functions ------


// ------ Endpoints ------
app.get('/', (req, res) => {
    console.log(req.body.first_name);
    res.status(200).send('Root endpoint was hit.');
});

app.post('/getAccountResources', async (req, res) => {
    console.log('Get account resources endpoint was hit.');
    console.log(req.body);

    const account_details = await getMartianAccountsAptosAmount(req.body.mneumonic);

    const json_response = {
        "address": account_details[0],
        "balance": account_details[1]
    }

    console.log(json_response);
    
    res.status(200).send(json_response);

});

app.post("/airpayTransaction", async (req, res) => {

    // To do:
        // Create webhook st. only JIT funding requests go through, not notifications etc.

    // Pseudo:
        // Check format of request before executing logic. If improper request, error
        // Call move logic
        // If move logic fails, error
        // If move logic succeeds, 200 + return jit funding response

    const data = req.body;
    console.log(data);
    // return;

    // Fields hard-coded in request for testing purposes
    user_address = data.user_address;
    public_key = data.public_key;
    signature = data.signature;
    transaction_amount = data.transaction_amount;

    response_status = await aptosBlockchainTransaction(user_address, public_key, signature, transaction_amount);
    console.log(response_status);
    // response_status = ACCEPT;

    const jsonResponse = {
        "token": data.token,
        "method": "pgfs.authorization",
        "user_token": data.user_token,
        "amount": data.gpa_order.jit_funding.amount,
        "original_jit_funding_token": data.gpa_order.jit_funding.token
    }

    // console.log(jsonResponse);
    
    res.status(response_status).send({
        "jit_funding": {
            "token": data.token,
            "method": "pgfs.authorization",
            "user_token": data.user_token,
            "amount": data.gpa_order.jit_funding.amount,
            "original_jit_funding_token": data.gpa_order.jit_funding.token
        }
    });
});
// ------ Endpoints ------

app.listen(process.env.PORT || port, () => console.log(`Express app listening at http::/localhost:${port}`));