import type { AWS } from "@serverless/typescript"
import basicAuthorizer from "@functions/basicAuthorizer"
import { join } from "path"
import { config } from "dotenv"

const pathToEnv = join(__dirname, "./.env")
config({ path: pathToEnv })

const serverlessConfiguration: AWS = {
    service: "authorization-service",
    frameworkVersion: "3",
    plugins: ["serverless-esbuild", "serverless-dotenv-plugin"],
    provider: {
        name: "aws",
        profile: "danny",
        region: process.env.REGION as AWS["provider"]["region"],
        runtime: "nodejs14.x",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            AUTH_USERNAME: process.env.AUTH_USERNAME,
            AUTH_PASSWORD: process.env.AUTH_PASSWORD,
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
        },
    },
    functions: { basicAuthorizer },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ["aws-sdk"],
            target: "node14",
            define: { "require.resolve": undefined },
            platform: "node",
            concurrency: 10,
        },
    },
}

module.exports = serverlessConfiguration
