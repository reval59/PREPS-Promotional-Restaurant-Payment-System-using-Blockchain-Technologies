const Web3 = require('web3')
const fs = require('fs')
const path = require('path')
const RESTAURANT_PATH = path.join(__dirname, './src/core/build/contracts/Restaurant.json')
const CONFIG_PATH = path.join(__dirname, './src/config/config.json')


const json = JSON.parse(fs.readFileSync(RESTAURANT_PATH, 'utf8'))
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
const web3 = new Web3(config.rpcServer.local)
const contract = new web3.eth.Contract(json.abi, "0x5E3263F3259F5e30F5Ad31e1055433E006517d18")
contract.methods.getRestaurantInfo().call({from:config.deployerAccount}).then(result=>{
    console.log(result)
})

