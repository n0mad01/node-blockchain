const Block = require('./block')
const {DIFFICULTY} = require('../config')

describe('Block', () => {
  let data, lastBlock, block

  beforeEach(() => {
    data = 'bar'
    lastBlock = Block.genesis()
    block = Block.mineBlock(lastBlock, data)
  })
  it('sets `data`', () => {
    expect(block.data).toEqual(data)
  })
  it('sets `lastHash`', () => {
    expect(block.lastHash).toEqual(lastBlock.hash)
  })
  it('generates a hash that matches difficulty', () => {
    expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY))
    console.log(block.toString())
  })
})
