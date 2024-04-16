import fs from 'fs'
import {
    isFileProcessed,
    saveFile,
    loadJsonDataToEntity,
} from '../loader_transactions'
import {
    isJSON,
    isValidTransactionFormat,
    isValidDeposit,
} from '../../utils/validateJson'
import { Transaction, File } from '../../entity'
import { AppDataSource } from '../database'

// Mocking the dependencies
jest.mock('fs')
jest.mock('../database')

describe('File processing functions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('isFileProcessed returns true if the file has been processed', async () => {
        const filename = 'example.json'
        const filesRepositoryMock = {
            findOne: jest.fn().mockResolvedValueOnce({ filename }),
        }
        const getRepositorySpy = jest.spyOn(AppDataSource, 'getRepository')
        getRepositorySpy.mockReturnValueOnce(filesRepositoryMock as any)

        const result = await isFileProcessed(filename)

        expect(result).toBe(true)
        expect(AppDataSource.getRepository).toHaveBeenCalledWith(File)
        expect(filesRepositoryMock.findOne).toHaveBeenCalledWith({
            where: { filename },
        })

        getRepositorySpy.mockRestore()
    })

    test('isFileProcessed returns false if the file has not been processed', async () => {
        const filename = 'example.json'
        const filesRepositoryMock = {
            findOne: jest.fn().mockResolvedValueOnce(null),
        }
        // Mocking getRepository method from TypeORM
        const getRepositorySpy = jest.spyOn(AppDataSource, 'getRepository')
        getRepositorySpy.mockReturnValueOnce(filesRepositoryMock as any)

        const result = await isFileProcessed(filename)

        expect(result).toBe(false)
        expect(AppDataSource.getRepository).toHaveBeenCalledWith(File)
        expect(filesRepositoryMock.findOne).toHaveBeenCalledWith({
            where: { filename },
        })

        getRepositorySpy.mockRestore()
    })

    // Similar tests for saveFile and loadJsonDataToEntity functions
})

describe('Utility functions', () => {
    test('isValidTransactionFormat returns true for valid transaction format', () => {
        const validTransaction = {
            involvesWatchonly: true,
            account: '',
            address: 'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8',
            category: 'receive',
            amount: 0.19602,
            label: '',
            confirmations: 3,
            blockhash:
                '397fe1b9e34cee9e74b53e7f03ca1c4af4cbbee68198e954403a05f4a156993c',
            blockindex: 75,
            blocktime: 1627656748873,
            txid: '1cf322e897ed0763a93a4a240964b6f397338f9f24f60b428765bd742c3dd652',
            vout: 54,
            walletconflicts: [],
            time: 1627656736649,
            timereceived: 1627656736649,
            'bip125-replaceable': 'no',
        }

        console.log(validTransaction)

        const result = isValidTransactionFormat(validTransaction)

        expect(result).toBe(true)
    })

    // Similar tests for isValidDeposit and isJSON functions
})
