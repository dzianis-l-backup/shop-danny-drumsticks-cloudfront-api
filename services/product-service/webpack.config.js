const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const path = require("path")
const slsw = require("serverless-webpack")

module.exports = (async () => {
    // const accountId = await slsw.lib.serverless.providers.aws.getAccountId()
    const webpack = await slsw.webpack

    return {
        entry: slsw.lib.entries,
        mode: slsw.lib.webpack.isLocal ? "development" : "production",
        target: "node",
        module: {
            rules: [
                {
                    test: /.tsx?$/,
                    use: "ts-loader",
                    exclude: [
                        [
                            path.resolve(__dirname, "node_modules"),
                            path.resolve(__dirname, ".serverless"),
                            path.resolve(__dirname, ".webpack"),
                        ],
                    ],
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
            plugins: [
                new TsconfigPathsPlugin({ configFile: "tsconfig.paths.json" }),
            ],
        },
    }
})()
