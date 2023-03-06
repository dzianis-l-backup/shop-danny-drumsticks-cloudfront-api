import { getProductsList } from "./handler"

describe("product-service", () => {
    describe("getProductsList", () => {
        it("should return the list of available products", async () => {
            const response = await getProductsList()

            expect(JSON.parse(response.body)).toMatchSnapshot()
        })
    })
})
