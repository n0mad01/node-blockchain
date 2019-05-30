const Wallet = require('./index')
const TransactionPool = require('./transaction-pool')

describe('Wallet', () => {
  let wallet, tp

  beforeEach(() => {
    wallet = new Wallet()
    tp = new TransactionPool()
  })

  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient

    beforeEach(() => {
      sendAmount = 50
      recipient = 'werh34jkh52j34k'
      transaction = wallet.createTransaction(recipient, sendAmount, tp)
    })

    describe('doing the same transaction again', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp)
      })

      it('doubles the `sendAmount` subtracted from wallet balance', () => {
        expect(transaction.outputs.find((output) => {
            return output.address === wallet.publicKey
          }).amount)
          .toEqual(wallet.balance - (sendAmount * 2))
      })

      it('clones the `sendAmount` output for the recipient', () => {
        expect(transaction.outputs.filter(output => {
            return output.address === recipient
          })
          .map(output => output.amount))
          .toEqual([sendAmount, sendAmount])
      })
    })
  })
})
