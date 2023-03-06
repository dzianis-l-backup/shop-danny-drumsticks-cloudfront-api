import { Stick, ErrorNotFound, Stock, StickStock } from "../types"
import AWS from "aws-sdk"

const dynamo = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION })

export abstract class ProductsController {
    static async getProductsList(): Promise<Stick[]> {
        const productsResults = await dynamo
            .scan({
                TableName: process.env.TABLE_PRODUCTS,
            })
            .promise()

        const stocksResults = await dynamo
            .scan({
                TableName: process.env.TABLE_STOCKS,
            })
            .promise()

        const sticks = productsResults.Items as Stick[]
        const stocks = stocksResults.Items as Stock[]

        // left join
        const sticksStocks: StickStock[] = sticks.map((stick) => ({
            ...stick,
            count: (
                stocks.find((stock) => stock.product_id === stick.id) as Stock
            ).count,
        }))

        return sticksStocks
    }

    static async getProductsById(
        id: string
    ): Promise<[Stick | undefined, ErrorNotFound | undefined]> {
        const results = await dynamo
            .query({
                TableName: process.env.TABLE_PRODUCTS,
                KeyConditionExpression: "id = :id",
                ExpressionAttributeValues: { ":id": id },
            })
            .promise()

        const stick = results.Items?.[0] as Stick
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
