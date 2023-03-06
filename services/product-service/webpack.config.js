const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const path = require("path")
const slsw = require("serverless-webpack")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = (async () => {
    return {
        mode: slsw.lib.webpack.isLocal ? "development" : "production",
        entry: slsw.lib.entries,
        output: {
            libraryTarget: "commonjs",
            path: path.join(__dirname, ".webpack"),
            filename: "[name].js",
        },
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
        optimization: {
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                }),
            ],
        },
    }
})()
