import fs from 'fs'
import pc from 'picocolors'
import { data } from '../data/transaction_data'
import { Transaction, File } from '../entity'
import { AppDataSource } from './database'

const isFileProcessed = async (filename: string) => {
    const filesRepository = AppDataSource.getRepository(File)
    const processedFile = await filesRepository.findOne({ where: { filename } })
    return !!processedFile
}

const saveFile = async (filename: string) => {
    const file = new File()
    file.filename = filename
    const filesRepository = AppDataSource.getRepository(File)
    await filesRepository.save(file)
}

const loadJsonDataToEntity = async (filePath: string, filename: string) => {
    const path = filePath + filename
    if (await isFileProcessed(filename)) {
        console.log(pc.yellow(`El archivo ${filename} ya ha sido procesado.`))
        return
    }

    const jsonData = JSON.parse(fs.readFileSync(path, 'utf8'))

    jsonData.transactions.map(async (data) => {
        const transactions = new Transaction()
        Object.assign(transactions, data)
        const transactionsRepository = AppDataSource.getRepository(Transaction)
        await transactionsRepository
            .findOneBy({ txid: data.txid })
            .then(async (transaction) => {
                if (!transaction) {
                    await transactionsRepository.save(transactions)
                }
            })
    })

    await saveFile(filename)
}

export const loadTransaction = async () => {
    try {
        for (const transaction of data) {
            await loadJsonDataToEntity(transaction.path, transaction.name)
        }

        console.log(pc.green('🟢 Transacciones almacenadas en Postgres'))
    } catch (error) {
        console.error('Error:', error)
    }
}
