const { pathsToModuleNameMapper } = require("ts-jest")
const {
    compilerOptions,
} = require("./services/product-service/tsconfig.paths.json")

module.exports = {
    moduleFileExtensions: ["js", "ts"],
    testPathIgnorePatterns: ["/node_modules/"],
    testTimeout: 50000,
    projects: [
        {
            displayName: "Product service",
            testEnvironment: "node",
            transform: {
                "^.+\\.[jt]s$": "babel-jest",
            },
            testMatch: ["<rootDir>/services/product-service/**/*.test.ts"],
            modulePaths: ["<rootDir>/services/product-service"],
            // https://stackoverflow.com/questions/52860868/typescript-paths-not-resolving-when-running-jest
            moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
        },
    ],
}
