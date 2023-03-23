import { getProductsListHandler } from "./handler"

describe("product-service", () => {
    describe("getProductsListHandler", () => {
        it("should return the list of available products", async () => {
            const response = await getProductsListHandler()

            expect(JSON.parse(response.body)).toMatchSnapshot()
        })
    })
})
