// $ HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
const Websocket = require('ws')

const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

class P2pServer {
  constructor(blockchain) {
    //console.log('P2pServer blockchain', blockchain)
    this.blockchain = blockchain
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
      console.log('data', data)

      this.blockchain.replaceChain(data)
    })
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain))
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket))
  }
}

module.exports = P2pServer
