const Block = require('./block');

//const block = new Block('A', 'B', 'C', 'D');
//console.log(block.toString());
//console.log(Block.genesis().toString())

const fooBlock = Block.mineBlock(Block.genesis(), 'foo')
console.log(fooBlock.toString())
