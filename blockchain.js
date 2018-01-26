// Object-Oriented
// TODO: what about a sender, and recipient class for that matter?

// Explain skeleton-based coding philosophy - fill things out bit by bit

const Block = require('./block');

class Blockchain {
  constructor() {
    // an array of Blocks | TODO, consider a Linked List?
    this.genesisBlock = Block.genesis();
    this.chain = [this.genesisBlock];
  }

  newBlock(data) {
    const block = Block.newBlock(this.lastBlock(), data);

    this.chain.push(block);

    return block;
  }

  lastBlock() {
    // This should return the last block in the chain
    return this.chain[this.chain.length-1];
  }

  /*
    Why this is necessary:
    When other nodes attempt to contribute to the blockchain, we must make sure
    that their blocks match our chain. If the proposed block's hash doesn't
    match our calculation, then it rejects too.

    This is primarily used in the valid chain check.

    Could inline into the isValidChain function. But probably more understanble
    declared outside in this case.
  */
  isValidNewBlock(newBlock, lastBlock) {
    if (
      (newBlock.lastHash !== lastBlock.hash) ||
      // this part ensures that a connecting node to the blockchain doesn't
      // have an improper hash function calculator
      (Block.blockHash(newBlock) !== newBlock.hash)
    ) {
      console.log('Invalid block');
      return false;
    }
    return true;
  }

  // chain is an array of blocks
  isValidChain(chain) {
    // first validate the genesis block in the chain
    if (this.genesisBlock.toString() !== chain[0].toString()) return false;
    // then validate every following block
    for (let i=1; i<chain.length; i++) {
      if (!this.isValidNewBlock(chain[i], chain[i-1])) {
        return false;
      }
    }

    return true;
  }

  /* replace the chain with this new one if it's:
    a) valid
    b) longer than the current chain
  */
  replaceChain(newChain) {
    if (newChain.length <= this.chain) {
      console.log('Received chain is not longer than the current chain.');
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log('The received chain is not valid.');
      return;
    }

    console.log('Replacing blockchain with the new chain.');
    this.chain = newChain;
  }

  // print the length of the chain, and call to String on every block in the chain
  toString() {
    let string = `Length of chain: ${this.chain.length}\n`;
    this.chain.forEach(block => {
      string += `${block.toString()}\n`;
    });
    return string;
  }
}

module.exports = Blockchain;
