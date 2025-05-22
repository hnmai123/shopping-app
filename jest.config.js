module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.js"
  ],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native"
      + "|@react-native"
      + "|@react-navigation"
      + "|expo(nent)?"
      + "|expo-modules-core"
      + "|@expo"
      + "|@expo/vector-icons"
      + "|firebase"
      + "|@firebase"
      + "|@react-native-async-storage"
      + ")"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "mjs"],
};