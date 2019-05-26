const Transaction = require('./transaction')
const Wallet = require('./index')

describe('Transaction', () => {
  let transaction, wallet, recipient, amount

  beforeEach(() => {
    wallet = new Wallet()
    amount = 50
    recipient = 'w443rt4234'
    transaction = Transaction.newTransaction(wallet, recipient, amount)
  })

  it('sets `amount` subtracted from balance', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount)
  })

  it('outputs `amount` added to balance', () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount)
      .toEqual(amount)
  })

  it('inputs balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance)
  })

  describe('transaction exceeding balance', () => {
  
    beforeEach(() => {
      amount = 10000
      transaction = Transaction.newTransaction(wallet, recipient, amount)
    })

    it('does not cerate a transaction', () => {
      expect(transaction).toEqual(undefined)
    })
  })
})

