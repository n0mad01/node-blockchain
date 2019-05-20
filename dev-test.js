/*
const Wallet = require('./wallet')
const wallet = new Wallet()
console.log(wallet.toString())
*/

const ChainUtil = require('./chain-util')
console.log(ChainUtil.id())

/*
const Blockchain = require('./blockchain');

const bc = new Blockchain()

for(let i=0; i<10; i++) {
  console.log(bc.addBlock(`newone ${i}`).toString())
}
*/
