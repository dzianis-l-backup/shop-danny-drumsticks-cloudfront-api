import { getProductsList } from "./handler"
import { getSticksMock } from "@mocks/products"

describe("product-service", () => {
    describe("getProductsList", () => {
        it("should return the list of available products", async () => {
            const sticksMock = await getSticksMock()
            const response = await getProductsList()

            expect(JSON.parse(response.body)).toEqual(sticksMock)
        })
    })
})
