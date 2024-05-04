const config = {
    testEnvironment: "jest-environment-node",
    transform: {},
    roots: [
        "test"
    ],
    testPathIgnorePatterns: [
        "/node_modules/"
    ],
    moduleFileExtensions: ["js", "json", "es6"]
};

export default config;