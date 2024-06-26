import fs from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import { Transaction, File } from '../entity'
import { AppDataSource } from './database'
import {
    isJSON,
    isValidTransactionFormat,
    isValidDeposit,
} from '../utils/validateJson'

// Check if a file has been processed before
export const isFileProcessed = async (filename: string) => {
    const filesRepository = AppDataSource.getRepository(File)
    const processedFile = await filesRepository.findOne({ where: { filename } })
    return !!processedFile
}

// Save file to database after processing
export const saveFile = async (filename: string) => {
    const file = new File()
    file.filename = filename
    const filesRepository = AppDataSource.getRepository(File)
    await filesRepository.save(file)
}

// Load JSON data from file and store transactions in database
export const loadJsonDataToEntity = async (
    filePath: string,
    filename: string
) => {
    const dir = path.join(filePath, filename)
    if (await isFileProcessed(filename)) {
        console.log(
            pc.yellow(`The file ${filename} has already been processed.`)
        )
        return
    }

    if (isJSON(dir)) {
        const jsonData = JSON.parse(fs.readFileSync(dir, 'utf8'))
        let count = 0
        if (!isValidDeposit(jsonData)) {
            console.log(pc.red(`❌ Invalid deposit format`))
        } else {
            for (const data of jsonData.transactions) {
                if (!isValidTransactionFormat(data)) {
                    console.log(pc.red(`❌ Invalid transaction format`))
                    continue
                }

                const transactions = new Transaction()
                Object.assign(transactions, data)
                const transactionsRepository =
                    AppDataSource.getRepository(Transaction)

                // The txid is unique, so we validate that there are no duplicate transactions
                const transaction = await transactionsRepository.findOneBy({
                    txid: data.txid,
                })
                if (!transaction && data.amount !== 0) {
                    count += 1
                    await transactionsRepository.save(transactions)
                }
            }
            //console.log(pc.bgMagenta(count))
            await saveFile(filename)
        }
    } else {
        console.log(pc.red('❌ The file is not in JSON format'))
    }
}

// Function to load transactions from a specified folder
export async function loadTransaction(folderPath) {
    try {
        // Read all files in the folder
        const files = fs.readdirSync(folderPath)

        // Process each file found
        for (const file of files) {
            //const filePath = path.join(folderPath, file)
            await loadJsonDataToEntity(folderPath, file)
        }

        console.log(pc.green('🟡 Transactions stored in Postgres'))
    } catch (error) {
        console.error(`Error reading folder ${folderPath}: ${error.message}`)
    }
}
