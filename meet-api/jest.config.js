/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  globals: {
    "auth" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBlbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.HCtLeNy5-33THRqf03ayTWV0UiTNEuBgKzE-G_03d3g"
  },
  testEnvironment: 'node',
  testMatch:["**/**/*.test.ts"],
  verbose: true,
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