import { getProductsByIdHandler } from "./handler"
import { getSticksMock } from "@mocks/products"
import { HttpStatusesMessages } from "@constants/http"
import { getStocksMock } from "@mocks/stocks"
import { StickStock } from "src/types"

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
