const products = require("../services/product-service/src/mocks/productsMock.json")
const stocks = require("../services/product-service/src/mocks/stocksMock.json")

const promisify = (data) => Promise.resolve(data)

const S3 = jest.fn(() => {
    return {
        getSignedUrlPromise: jest.fn((command, params) => {
            debugger
            return promisify(command + params.Bucket + params.Key)
        }),
    }
})

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
        transactWrite: jest.fn(() => {
            return {
                promise: jest.fn(() => {}),
            }
        }),
    })),
}

module.exports = {
    DynamoDB,
    S3,
}
