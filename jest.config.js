module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testEnvironment: "node",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx"
  ]
}
