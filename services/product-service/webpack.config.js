// todo: custom webpack plugin
const webpack = require("webpack")
const slsw = require("serverless-webpack")

module.exports = (async () => {
    debugger
    const accountId = await slsw.lib.serverless.providers.aws.getAccountId()
    const webpack = await slsw.webpack
    console.log(webpack)

    return {
        ...webpack,
    }
})()
