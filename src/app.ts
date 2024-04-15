import loaders from './loaders'
import { stroutTransactionResult } from './transaction'

async function main() {
    loaders().then(async () => {
        await stroutTransactionResult()
    })
}

if (require.main === module) {
    main()
}
