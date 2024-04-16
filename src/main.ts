import fs from 'node:fs'
import { environments } from './config'
import loaders from './loaders'
import { loadTransaction } from './loaders/loader_transactions'
import { stroutTransactionResult } from './transactionResults'

// Function to load transactions initially
async function initialLoadTransactions(folderPath) {
    try {
        await loadTransaction(folderPath)
        await stroutTransactionResult()
    } catch (error) {
        console.error(`Error loading initial transactions: ${error}`)
    }
}

// Function to handle file change events
async function handleFileChange(eventType, filename) {
    if (eventType === 'rename') {
        try {
            await loadTransaction(environments.path_deposits)
            await stroutTransactionResult()
        } catch (error) {
            console.error(`Error reloading transactions: ${error}`)
        }
    }
}

async function main() {
    await loaders()

    // Path to the folder to monitor for changes
    const folderPath = environments.path_deposits

    // Load transactions initially
    await initialLoadTransactions(folderPath)

    // Watch for changes in the folder and reload transactions
    fs.watch(folderPath, handleFileChange)
}

if (require.main === module) {
    main()
}
