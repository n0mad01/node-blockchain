// $ HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
const Websocket = require('ws')

const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS'
}

class P2pServer {
  constructor(blockchain, transactionPool) {
    //console.log('P2pServer blockchain', blockchain, transactionPool)
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.sockets = []
  }

  listen() {
    const server = new Websocket.Server({port: P2P_PORT})
    server.on('connection', (socket) => this.connectSocket(socket))
    this.connectToPeers()
    console.log(`Listening for peer2peer connections on ${P2P_PORT}`)
  }

  connectToPeers() {
    peers.forEach(peer => {
      //ws://localhost:5001 || ws://192.168.1.11:5001
      const socket = new Websocket(peer)
      socket.on('open', () => {
        this.connectSocket(socket)
      })
    })
  }

  connectSocket(socket) {
    this.sockets.push(socket)
    console.log('Socket connected')
    this.messageHandler(socket)
    //console.log('Socket connected JSON', this.blockchain.chain)
    //socket.send(JSON.stringify(this.blockchain.chain))
    this.sendChain(socket)
  }

  messageHandler(socket) {
    socket.on('message', message => {
      //const data = JSON.parse(JSON.stringify(message))
      const data = JSON.parse(message)
      //console.log('data', data)
      switch(data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain)
          break
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction) 
          break
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear()
          break
      }
    })
  }

  sendChain(socket) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }))
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction
    }))
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket))
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach((socket) => {
      return this.sendTransaction(socket, transaction)
    })
  }

  broadcastClearTransactions() {
    this.sockets.forEach((socket) => {
      return socket.send(JSON.stringify({
        type: MESSAGE_TYPES.clear_transactions
      }))
    })
  }
}

module.exports = P2pServer
