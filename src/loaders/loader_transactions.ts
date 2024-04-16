import fs from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import { Transaction, File } from '../entity'
import { AppDataSource } from './database'
import { isJSON } from '../utils/validateJson'

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
    const dir = path.join(filePath, filename)
    if (await isFileProcessed(filename)) {
        console.log(pc.yellow(`El archivo ${filename} ya ha sido procesado.`))
        return
    }

    if (isJSON(dir)) {
        const jsonData = JSON.parse(fs.readFileSync(dir, 'utf8'))

        jsonData.transactions.map(async (data) => {
            const transactions = new Transaction()
            Object.assign(transactions, data)
            const transactionsRepository =
                AppDataSource.getRepository(Transaction)
            await transactionsRepository
                .findOneBy({ txid: data.txid })
                .then(async (transaction) => {
                    if (!transaction && data.amount != 0) {
                        await transactionsRepository.save(transactions)
                    }
                })
        })

        await saveFile(filename)
    } else {
        console.log(pc.red('❌ El archivo no es formato JSON'))
    }
}

export async function loadTransaction(folderPath) {
    try {
        // Lee todos los archivos en la carpeta
        const files = fs.readdirSync(folderPath)

        // Procesa cada archivo encontrado
        for (const file of files) {
            const filePath = path.join(folderPath, file)
            await loadJsonDataToEntity(folderPath, file)
        }

        console.log(pc.green('🟡 Transacciones almacenadas en Postgres'))
    } catch (error) {
        console.error(
            `Error al leer la carpeta ${folderPath}: ${error.message}`
        )
    }
}
