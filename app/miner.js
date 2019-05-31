class Miner {

  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet
    this.p2pServer = p2pServer
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions()  

    // TODO : reward
    // TODO : create block consisting of valid transactions
    // TODO : synchronize chains
    // TODO : clear transaction pool
    // TODO : broadcast clear transaction pools
  }
}

module.exports = Miner
