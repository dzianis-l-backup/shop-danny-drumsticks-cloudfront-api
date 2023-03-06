import { getProductsList } from "./handler"

jest.mock("aws-sdk", () => {
    const moduleProducts = jest.requireActual("@mocks/products")
    const moduleStocks = jest.requireActual("@mocks/stocks")
    const productsPromise = Promise.resolve(
        moduleProducts.getSticksMock()
    ).then((sticks) => ({
        Items: sticks,
    }))
    const stocksPromise = Promise.resolve(moduleStocks.getStocksMock()).then(
        (stocks) => ({
            Items: stocks,
        })
    )

    const AWS = {
        DynamoDB: {
            DocumentClient: jest.fn(() => ({
                scan: jest.fn(({ TableName }) => ({
                    promise: jest.fn(() => {
                        if (TableName === process.env.TABLE_PRODUCTS) {
                            return productsPromise
                        }

                        if (TableName === process.env.TABLE_STOCKS) {
                            return stocksPromise
                        }
                    }),
                })),
            })),
        },
    }

    return AWS
})

describe("product-service", () => {
    describe("getProductsList", () => {
        it("should return the list of available products", async () => {
            const response = await getProductsList()

            expect(JSON.parse(response.body)).toMatchSnapshot()
        })
    })
})
