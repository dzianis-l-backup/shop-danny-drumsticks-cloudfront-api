import { getProductsById } from "./handler"
import { getSticksMock } from "@mocks/products"

jest.mock("aws-sdk", () => {
    const module = jest.requireActual("@mocks/products")
    const AWS = {
        DynamoDB: {
            DocumentClient: jest.fn(() => ({
                scan: jest.fn(() => ({
                    promise: jest.fn(() =>
                        Promise.resolve(module.getSticksMock()).then(
                            (sticks) => ({
                                Items: sticks,
                            })
                        )
                    ),
                })),
                query: jest.fn(
                    ({ ExpressionAttributeValues: { ":id": id } }) => ({
                        promise: jest.fn(() =>
                            Promise.resolve(module.getSticksMock()).then(
                                (sticks) => ({
                                    Items: [
                                        sticks.find((stick) => stick.id === id),
                                    ],
                                })
                            )
                        ),
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
            const response = await getProductsById({
                pathParameters: { id: stickFirst.id },
            })

            expect(response.statusCode).toEqual(200)
            expect(JSON.parse(response.body)).toEqual(stickFirst)
        })

        it("should return 404 for a missing id", async () => {
            const productId = "foo"
            const response = await getProductsById({
                pathParameters: { id: productId },
            })

            expect(response.statusCode).toBe(404)
            expect(JSON.parse(response.body)).toEqual({
                message: `Product with id ${productId} not found`,
            })
        })
    })
})
