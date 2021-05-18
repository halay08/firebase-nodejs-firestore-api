/* eslint-disable */

module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    coverageDirectory: 'coverage',

    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/(?!@foo)'],

    preset: 'ts-jest',

    testEnvironment: 'node',

    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        }
    },

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    moduleNameMapper: {
        '@/src/(.*)': '<rootDir>/src/$1',
        '@/api/http/(.*)': '<rootDir>/src/api/http/$1',
        '@/api/(.*)': '<rootDir>/src/api/$1',
        '@/api': '<rootDir>/src/api',
        '@/app/(.*)': '<rootDir>/src/app/$1',
        '@/domain/(.*)': '<rootDir>/src/domain/$1',
        '@/domain': '<rootDir>/src/domain',
        '@/services/(.*)': '<rootDir>/src/app/services/$1',
        '@/services': '<rootDir>/src/app/services',
        '@/libs/(.*)': '<rootDir>/src/libs/$1',
        '@/infra/(.*)': '<rootDir>/src/infra/$1',
        '@/infra/repositories/(.*)': '<rootDir>/src/infra/database/repositories/$1'
    }
};
