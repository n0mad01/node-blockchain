const Block = require('./block')

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
})
