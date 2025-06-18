import * as CryptoJS from 'crypto-js';

// Difficulty of PoW (number of leading zeros required in the hash)
const DIFFICULTY = 4;

/**
 * Block class represents a block in the blockchain
 */
class Block {
    index: number;
    timestamp: number;
    data: string;
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(index: number, data: string, previousHash: string = '') {
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0; // Random number (nonce) to be found during mining
        this.hash = this.calculateHash(); // Initial hash
    }

    /**
     * Calculate the SHA-256 hash of the block.
     * This hash includes all the block's properties.
     */
    calculateHash(): string {
        return CryptoJS.SHA256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    /**
     * Perform Proof of Work (PoW) to find a valid hash.
     * This function increments the nonce and recalculates the hash
     * until a hash starting with '0' repeated DIFFICULTY times is found.
     */
    mineBlock(): void {
        console.log(`Starting to mine block #${this.index}...`);
        while (this.hash.substring(0, DIFFICULTY) !== Array(DIFFICULTY + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block #${this.index} mined: ${this.hash}`);
    }
}

/**
 * Function to check if a hash is valid for the given difficulty.
 */
function isValidHash(hash: string): boolean {
    return hash.substring(0, DIFFICULTY) === Array(DIFFICULTY + 1).join("0");
}

/**
 * Function to simulate the creation and mining of blocks
 */
function simulatePoW(): void {
    console.log("--- Proof of Work (PoW) Simulation ---");
    console.log(`Difficulty (number of leading zeros): ${DIFFICULTY}\n`);

    // Genesis block (first block)
    const genesisBlock = new Block(0, "Genesis Block", "0");
    genesisBlock.mineBlock();
    console.log(`Hash of Genesis Block: ${genesisBlock.hash}, Nonce: ${genesisBlock.nonce}\n`);

    // Create and mine the second block
    const block2 = new Block(1, "Transaction Data 1", genesisBlock.hash);
    block2.mineBlock();
    console.log(`Hash of Block 2: ${block2.hash}, Nonce: ${block2.nonce}\n`);

    // Validate the second block
    console.log(`\nChecking validity of Block 2...`);
    const isBlock2Valid = isValidHash(block2.hash);
    console.log(`Block 2 valid: ${isBlock2Valid}`);
    console.log(`Recalculated hash of Block 2: ${block2.calculateHash()}`);
    console.log(`Stored hash in Block 2: ${block2.hash}`);
    console.log(`Checking if stored hash matches recalculated hash: ${block2.hash === block2.calculateHash()}\n`);

    // Create and mine the third block
    const block3 = new Block(2, "Transaction Data 2", block2.hash);
    block3.mineBlock();
    console.log(`Hash of Block 3: ${block3.hash}, Nonce: ${block3.nonce}\n`);

    // Validate the third block
    console.log(`Checking validity of Block 3...`);
    const isBlock3Valid = isValidHash(block3.hash);
    console.log(`Block 3 valid: ${isBlock3Valid}`);
    console.log(`Recalculated hash of Block 3: ${block3.calculateHash()}`);
    console.log(`Stored hash in Block 3: ${block3.hash}`);
    console.log(`Checking if stored hash matches recalculated hash: ${block3.hash === block3.calculateHash()}\n`);

    // Example of an invalid block (data tampered with after mining)
    console.log("--- Example of an invalid block (tampered data) ---");
    const tamperedBlock = new Block(3, "Original Data", block3.hash);
    tamperedBlock.mineBlock(); // Mine this block with original data

    console.log(`\nTampered block (before tampering): ${tamperedBlock.hash}`);

    // Tamper with data after mining
    tamperedBlock.data = "Tampered Data!";
    const isTamperedBlockValid = isValidHash(tamperedBlock.calculateHash()); // Check with the new hash after tampering
    console.log(`Hash of tampered block after changing data: ${tamperedBlock.calculateHash()}`);
    console.log(`Tampered block valid (based on new hash): ${isTamperedBlockValid} (expected to be false because the hash changed and no longer matches the original PoW)`);
    console.log(`Checking if stored hash matches recalculated hash: ${tamperedBlock.hash === tamperedBlock.calculateHash()} (expected to be false)`);
}

// Run the simulation
simulatePoW();
