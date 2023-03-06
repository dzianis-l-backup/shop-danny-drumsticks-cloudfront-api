import { Stick, ErrorNotFound } from "../types"
import { getSticksMock } from "@mocks/products"
import AWS from "aws-sdk"

const dynamo = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION })

export abstract class ProductsController {
    static async getProductsList(): Promise<Stick[]> {
        const results = await dynamo
            .scan({
                TableName: process.env.TABLE_PRODUCTS,
            })
            .promise()

        return results.Items as Stick[]
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
