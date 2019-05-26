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

  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true)
  })

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 340000
    expect(Transaction.verifyTransaction(transaction)).toBe(false)
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

  describe('updating a tranasction', () => {
    let nextAmount, nextRecipient

    beforeEach(() => {
        nextAmount = 20
        nextAmount = 'sldfjkljw431'
        transaction = transaction.update(wallet, nextRecipient, nextAmount)
    })

    it('subtracts the next amount from the senders output', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount - nextAmount)
    })

    it('outputs am amount for the next recipient', () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
        .toEqual(nextAmount)
    })
  })
})

