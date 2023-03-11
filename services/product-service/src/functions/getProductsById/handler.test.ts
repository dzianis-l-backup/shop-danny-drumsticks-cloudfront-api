import { getProductsByIdHandler } from "./handler"
import { getSticksMock } from "@mocks/products"
import { HttpStatusesMessages } from "@constants/http"
import { getStocksMock } from "@mocks/stocks"
import { Stick, StickStock, Stock } from "src/types"

jest.mock("aws-sdk", () => {
    const moduleProducts = jest.requireActual("@mocks/products")
    const moduleStocks = jest.requireActual("@mocks/stocks")
    const productsPromise = Promise.resolve(
        moduleProducts.getSticksMock() as Stick[]
    )
    const stocksPromise = Promise.resolve(
        moduleStocks.getStocksMock() as Stock[]
    )

    const AWS = {
        DynamoDB: {
            DocumentClient: jest.fn(() => ({
                scan: jest.fn(() => ({
                    promise: jest.fn(() =>
                        Promise.resolve(productsPromise).then((sticks) => ({
                            Items: sticks,
                        }))
                    ),
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
                                return productsPromise.then((sticks) => {
                                    return {
                                        Items: [
                                            sticks.find(
                                                (stick) => stick.id === id
                                            ),
                                        ],
                                    }
                                })
                            }

                            if (TableName === process.env.TABLE_STOCKS) {
                                return stocksPromise.then((stocks) => {
                                    return {
                                        Items: [
                                            stocks.find(
                                                (stock) =>
                                                    stock.product_id ===
                                                    product_id
                                            ),
                                        ],
                                    }
                                })
                            }
                        }),
                    })
                ),
            })),
        },
    }

    return AWS
})

describe("product-service", () => {
    describe("getProductsList", () => {
        it("should return a product with a given id", async () => {
            const [stickFirst] = await getSticksMock()
            const stocks = await getStocksMock()
            const stickStock: StickStock = {
                ...stickFirst,
                count: stocks.find(
                    (stock) => stock.product_id === stickFirst.id
                ).count,
            }
            const response = await getProductsByIdHandler({
                pathParameters: { id: stickFirst.id },
            })

            expect(response.statusCode).toEqual(200)
            expect(JSON.parse(response.body)).toEqual(stickStock)
        })

        it("should return 404 for a missing id", async () => {
            const productId = "foo"
            const response = await getProductsByIdHandler({
                pathParameters: { id: productId },
            })

            expect(response.statusCode).toBe(404)
            expect(JSON.parse(response.body)).toEqual({
                message: HttpStatusesMessages[404],
            })
        })
    })
})
