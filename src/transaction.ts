import { repository } from './loaders/database'
import { Transaction, Users } from './entity'

const getAllTransactions = async (): Promise<Transaction[]> => {
    return await repository.transactionsRepository.find()
}

const getAllUsers = async (): Promise<Users[]> => {
    return await repository.usersRepository.find()
}

const calculateTotals = (transactions: Transaction[], users: Users[]) => {
    const totalsWithRef: Record<string, { count: number; sum: number }> = {}
    let totalWithoutRef = { count: 0, sum: 0 }

    transactions.forEach((transaction) => {
        const client = users.find(
            (user) => user.address === transaction.address
        )
        const amount = parseFloat(transaction.amount.toString())

        if (client) {
            const clientAddress = client.address

            if (!totalsWithRef[clientAddress]) {
                totalsWithRef[clientAddress] = { count: 0, sum: 0 }
            }

            totalsWithRef[clientAddress].count++
            totalsWithRef[clientAddress].sum += amount
        } else {
            totalWithoutRef.count++
            totalWithoutRef.sum += amount
        }
    })

    return { totalsWithRef, totalWithoutRef }
}

export const stroutTransactionResult = async () => {
    const allTransactions = await getAllTransactions()
    const allUsers = await getAllUsers()

    const validTransactions = allTransactions.filter(
        (transaction) => transaction.confirmations >= 6
    )

    const { totalsWithRef, totalWithoutRef } = calculateTotals(
        validTransactions,
        allUsers
    )

    printResults(totalsWithRef, totalWithoutRef, validTransactions, allUsers)
}

const printResults = (
    totalsWithRef: Record<string, { count: number; sum: number }>,
    totalWithoutRef: { count: number; sum: number },
    validTransactions: Transaction[],
    allUsers: Users[]
) => {
    // Imprimir resultados para cada cliente
    for (const recipient in totalsWithRef) {
        const user = allUsers.find((u) => u.address === recipient)
        if (user) {
            console.log(
                `Deposited for ${user.name}: count=${totalsWithRef[recipient].count} sum=${totalsWithRef[recipient].sum}`
            )
        }
    }

    // Imprimir resultado para depósitos sin referencia
    console.log(
        `Deposited without reference: count=${totalWithoutRef.count} sum=${totalWithoutRef.sum}`
    )

    // Calcular y mostrar el menor y mayor depósito válido
    const amounts = validTransactions.map((transaction) =>
        parseFloat(transaction.amount.toString())
    )
    console.log(`Smallest valid deposit: ${Math.min(...amounts)}`)
    console.log(`Largest valid deposit: ${Math.max(...amounts)}`)
}
