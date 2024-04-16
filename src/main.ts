import fs from 'node:fs'
import { enviroments } from './config'
import loaders from './loaders'
import { loadTransaction } from './loaders/loader_transactions'
import { stroutTransactionResult } from './transactionResults'

async function main() {
    // Cargar inicializadores
    await loaders()

    const folderPath = enviroments.path_deposits
    await loadTransaction(folderPath)

    fs.watch(folderPath, (eventType, filename) => {
        if (eventType === 'rename') {
            loadTransaction(folderPath)
        }
    })

    // Procesar resultados de transacciones
    await stroutTransactionResult()
}

if (require.main === module) {
    main()
}
