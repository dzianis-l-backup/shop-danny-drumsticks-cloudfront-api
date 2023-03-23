const products = require("../services/product-service/src/mocks/productsMock.json")
const stocks = require("../services/product-service/src/mocks/stocksMock.json")
const fs = require("fs")

const promisify = (data) => Promise.resolve(data)
const log = (...args) => console.log("unit-test logs: ", ...args)

const SQS = jest.fn(() => {
    const MOCK_QUEUE_URL = "MOCK_QUEUE_URL"

    return {
        getQueueUrl: jest.fn((_, callback) => {
            callback(null, { QueueUrl: MOCK_QUEUE_URL })
        }),

        sendMessage: jest.fn((_, callback) => {
            callback(null, null)
        }),
    }
})

const SNS = jest.fn(() => {
    return {
        publish: jest.fn((...args) => {
            log("publish", ...args)

            return { promise: jest.fn(promisify) }
        }),
    }
})

const S3 = (() => {
    const FILE_NAME = "myFile.csv"
    const FILE_PATH = __dirname + "/" + FILE_NAME

    const instance = {
        getSignedUrlPromise: jest.fn((command, params) => {
            return promisify(command + params.Bucket + params.Key)
        }),

        getObject: jest.fn(() => {
            return {
                createReadStream: jest.fn(() => {
                    return fs.createReadStream(FILE_PATH)
                }),
            }
        }),

        copyObject: jest.fn(() => {
            return {
                promise: jest.fn(promisify),
            }
        }),

        deleteObject: jest.fn(() => {
            return {
                promise: jest.fn(promisify),
            }
        }),
    }

    return jest.fn(() => {
        return instance
    })
})()

const DynamoDB = {
    DocumentClient: jest.fn(() => ({
        scan: jest.fn(({ TableName }) => ({
            promise: jest.fn(() => {
                if (TableName === process.env.TABLE_PRODUCTS) {
                    return promisify({ Items: products })
                }

                if (TableName === process.env.TABLE_STOCKS) {
                    return promisify({ Items: stocks })
                }
            }),
        })),
        query: jest.fn(
            ({
                TableName,
                ExpressionAttributeValues: {
                    ":id": id,
                    ":product_id": product_id,
                },
            }) => ({
                promise: jest.fn(() => {
                    if (TableName === process.env.TABLE_PRODUCTS) {
                        return promisify({
                            Items: [products.find((stick) => stick.id === id)],
                        })
                    }

                    if (TableName === process.env.TABLE_STOCKS) {
                        return promisify({
                            Items: [
                                stocks.find(
                                    (stock) => stock.product_id === product_id
                                ),
                            ],
                        })
                    }
                }),
            })
        ),
        transactWrite: jest.fn((...args) => {
            log("transactWrite", ...args)

            return {
                promise: jest.fn(promisify),
            }
        }),
        batchWrite: jest.fn((...args) => {
            log("batchWrite", ...args)

            return {
                promise: jest.fn(promisify),
            }
        }),
    })),
}

module.exports = {
    DynamoDB,
    S3,
    SQS,
    SNS,
}
