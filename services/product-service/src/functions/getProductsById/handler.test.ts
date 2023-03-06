import { getProductsById } from "./handler"
import { getSticksMock } from "@mocks/products"

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
            const response = await getProductsById("")

            expect(response.statusCode).toBe(404)
            expect(JSON.parse(response.body)).toEqual({
                message: "Product with id undefined not found",
            })
        })
    })
})
