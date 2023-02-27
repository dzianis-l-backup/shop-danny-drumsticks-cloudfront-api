import { Stick } from "../types"
import { getSticksMock } from "@mocks/products"

export abstract class ProductsController {
    static async getProductsList(): Promise<Stick[]> {
        return getSticksMock()
    }

    static async getProductsById(id: string): Promise<Stick | null> {
        const stick =
            (await getSticksMock()).find((stick) => stick.id === id) || null

        return stick
    }
}
