import { repository } from './loaders/database'
import { Transaction, Users } from './entity'

// Function to output transaction results
export const stroutTransactionResult = async () => {
    // Retrieve all transactions and users
    const allTransactions = await getAllTransactions()
    const allUsers = await getAllUsers()

    // Filter transactions with confirmations greater than or equal to 6
    const validTransactions = allTransactions.filter(
        (transaction) => transaction.confirmations >= 6
    )

    // Calculate totals for transactions with and without references
    const { totalsWithRef, totalWithoutRef } = calculateTotals(
        validTransactions,
        allUsers
    )

    // Print the results
    printResults(totalsWithRef, totalWithoutRef, validTransactions, allUsers)
}

// Retrieve all transactions from the database
const getAllTransactions = async (): Promise<Transaction[]> => {
    return await repository.transactionsRepository.find()
}

// Retrieve all users from the database
const getAllUsers = async (): Promise<Users[]> => {
    return await repository.usersRepository.find()
}

// Calculate totals for transactions with and without references
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

            // Increment counts and sums for transactions with references
            if (!totalsWithRef[clientAddress]) {
                totalsWithRef[clientAddress] = { count: 0, sum: 0 }
            }

            totalsWithRef[clientAddress].count++
            totalsWithRef[clientAddress].sum += amount
        } else {
            // Increment counts and sums for transactions without references
            totalWithoutRef.count++
            totalWithoutRef.sum += amount
        }
    })

    return { totalsWithRef, totalWithoutRef }
}

// Print the transaction results
const printResults = (
    totalsWithRef: Record<string, { count: number; sum: number }>,
    totalWithoutRef: { count: number; sum: number },
    validTransactions: Transaction[],
    allUsers: Users[]
) => {
    const toFixedValue = 8

    // Print results for each recipient
    for (const recipient in totalsWithRef) {
        const user = allUsers.find((u) => u.address === recipient)
        if (user) {
            console.log(
                `Deposited for ${user.name}: count=${
                    totalsWithRef[recipient].count
                } sum=${totalsWithRef[recipient].sum.toFixed(toFixedValue)}`
            )
        }
    }

    // Print result for deposits without reference
    console.log(
        `Deposited without reference: count=${
            totalWithoutRef.count
        } sum=${totalWithoutRef.sum.toFixed(toFixedValue)}`
    )

    // Calculate and display the smallest and largest valid deposits
    const amounts = validTransactions.map((transaction) =>
        parseFloat(transaction.amount.toString())
    )
    const amountsPositive = amounts.filter((amount) => amount >= 0)
    const amountsNegative = amounts.filter((amount) => amount < 0)

    const maxPositive = Math.max(...amountsPositive)
    const minPositive = Math.min(...amountsPositive)

    const maxNegative = Math.max(...amountsNegative)
    const minNegative = Math.min(...amountsNegative)

    console.log(
        `Smallest valid deposit: ${
            minPositive <= Math.abs(maxNegative)
                ? minPositive.toFixed(toFixedValue)
                : maxNegative.toFixed(toFixedValue)
        }`
    )
    console.log(
        `Largest valid deposit: ${
            maxPositive >= Math.abs(minNegative)
                ? maxPositive.toFixed(toFixedValue)
                : minNegative.toFixed(toFixedValue)
        }`
    )
}
