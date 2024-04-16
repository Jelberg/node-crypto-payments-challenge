import fs from 'node:fs'

export const isJSON = (filePath: string) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8')

        JSON.parse(data)
        return true
    } catch (error) {
        return false
    }
}

export const isValidTransactionFormat = (data: Object) => {
    return (
        typeof data === 'object' &&
        data.hasOwnProperty('involvesWatchonly') &&
        data.hasOwnProperty('account') &&
        data.hasOwnProperty('address') &&
        data.hasOwnProperty('category') &&
        data.hasOwnProperty('amount') &&
        data.hasOwnProperty('label') &&
        data.hasOwnProperty('confirmations') &&
        data.hasOwnProperty('blockhash') &&
        data.hasOwnProperty('blockindex') &&
        data.hasOwnProperty('blocktime') &&
        data.hasOwnProperty('txid') &&
        data.hasOwnProperty('vout') &&
        data.hasOwnProperty('walletconflicts') &&
        data.hasOwnProperty('time') &&
        data.hasOwnProperty('timereceived') &&
        data.hasOwnProperty('bip125-replaceable')
    )
}

export const isValidDeposit = (data: Object) => {
    return (
        typeof data === 'object' &&
        data.hasOwnProperty('transactions') &&
        data.hasOwnProperty('removed') &&
        data.hasOwnProperty('lastblock')
    )
}
