import fs from 'node:fs'
import { environments } from './config'
import loaders from './loaders'
import { loadTransaction } from './loaders/loader_transactions'
import { stroutTransactionResult } from './transactionResults'

// Main function to start the application
async function main() {
    // Load initializers
    await loaders()

    // Path to the folder to monitor for changes
    const folderPath = environments.path_deposits

    // Load transactions initially
    await loadTransaction(folderPath)

    // Watch for changes in the folder and reload transactions
    fs.watch(folderPath, (eventType, filename) => {
        if (eventType === 'rename') {
            loadTransaction(folderPath)
        }
    })

    // Process transaction results
    await stroutTransactionResult()
}

if (require.main === module) {
    main()
}
