module.exports = {
  preset: "ts-jest", // Use ts-jest to transform TypeScript files
  testEnvironment: "node", // Set test environment to Node.js
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest for TypeScript files
  },
  moduleFileExtensions: ["ts", "js"], // Recognize .ts and .js extensions
  testPathIgnorePatterns: ["/node_modules/"],
  globals: {
    "ts-jest": {
      useESModules: true, // Allow Jest to handle ESModules
    },
  },
};
