module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleDirectories: ['node_modules', 'src'],
}
