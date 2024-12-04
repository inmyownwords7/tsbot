import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@tests/(.*)$': '<rootDir>/tests/$1'
    },
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
};

export default config;
