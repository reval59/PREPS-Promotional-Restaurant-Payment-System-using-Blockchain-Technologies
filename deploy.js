const Web3 = require('web3')
const fs = require('fs')
const path = require('path')
const DEPLOYMENT_PATH = path.join(__dirname, './src/core/build/contracts/Deployment.json')
const CONFIG_PATH = path.join(__dirname, './src/config/config.json')


const json = JSON.parse(fs.readFileSync(DEPLOYMENT_PATH, 'utf8'))
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
const web3 = new Web3(config.rpcServer.default)
const contract = new web3.eth.Contract(json.abi)
contract.deploy({
    data:json.bytecode
})
    .send({from: config.deployerAccount, gas: config.GAS_LIMIT}, (error, transactionHash) => {
        if (error){ console.log(error)}
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log(confirmationNumber, receipt)
    })
    .then((newContractInstance) => {
        console.log(json.contractName)
        console.log(newContractInstance.options.address)
    });