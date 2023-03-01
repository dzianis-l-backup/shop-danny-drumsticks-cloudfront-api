import { Stick, ErrorNotFound } from "../types"
import { getSticksMock } from "@mocks/products"

export abstract class ProductsController {
    static async getProductsList(): Promise<Stick[]> {
        return getSticksMock()
    }

    static async getProductsById(
        id: string
    ): Promise<[Stick | undefined, ErrorNotFound | undefined]> {
        const stick =
            (await getSticksMock()).find((stick) => stick.id === id) || null

        if (!stick) {
            return [
                null,
                {
                    message: `Product with id ${id} not found`,
                    statusCode: 404,
                },
            ]
        }

        return [stick, undefined]
    }
}
