const { Raydium, TxBuilder } = require('@raydium-io/raydium-sdk-v2');
const { Connection, Keypair } = require('@solana/web3.js');

async function swap(tokenAddress, amountInSol, action, privateKey) {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const owner = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
    const raydium = await Raydium.load({ connection, owner });

    const swapConfig = {
        tokenIn: action === 'buy' ? 'SOL' : tokenAddress,
        tokenOut: action === 'buy' ? tokenAddress : 'SOL',
        amountIn: amountInSol,
        slippage: 0.02,
    };

    const { tx } = await raydium.swap(swapConfig);
    const txId = await connection.sendTransaction(tx, [owner]);
    console.log(`${action} TX: ${txId}`);
    return txId;
}

const [tokenAddress, amountInSol, action, privateKey] = process.argv.slice(2);
swap(tokenAddress, parseFloat(amountInSol), action, privateKey);
