import { getProductsList } from "./handler"

describe("product-service", () => {
    describe("getProductsList", () => {
        it.skip("should return the list of available products", async () => {
            const response = await getProductsList()

            expect(JSON.parse(response.body)).toMatchSnapshot()
        })
    })
})
