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
