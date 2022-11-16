/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  globals: {
    "address" : "http://localhost:3001"
  },
  testEnvironment: 'node',
  testMatch:["**/**/*.test.ts"],
  //verbose: true,
  //forceExit: true,
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        // ts-jest configuration goes here
      },
    ],
  },
};