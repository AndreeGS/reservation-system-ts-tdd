module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        "^.+\\.(ts|tsx|js)$": "ts-jest"
    },
    transformIgnorePatterns: [
    "/node_modules/(?!uuid)"
    ]
}