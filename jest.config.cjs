/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest', 
            {
                useESM: true,
                tsconfig: 'tsconfig.test.json',
                isolatedModules: true,
                diagnostics: {
                    warnOnly: true
                }
            }
        ]
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
    verbose: true,
    silent: false,
    testTimeout: 10000,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
}; 