import {
    Stick,
    Stock,
    StickStock,
    HttpStatuses,
    ControllerResponse,
} from "../types"
import AWS from "aws-sdk"
import { v4 as uuid4 } from "uuid"
import { createProductSchema } from "@validation/createProduct"
import { logger } from "@libs/logger"

const dynamo = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION })

export abstract class ProductsController {
    static async getProductsList(): Promise<ControllerResponse<Stick[]>> {
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

        return { payload: sticksStocks, statusCode: HttpStatuses.OK }
    }

    static async getProductsById(
        id: string
    ): Promise<ControllerResponse<StickStock>> {
        const resultProducts = await dynamo
            .query({
                TableName: process.env.TABLE_PRODUCTS,
                KeyConditionExpression: "id = :id",
                ExpressionAttributeValues: { ":id": id },
            })
            .promise()

        const stick = resultProducts.Items?.[0] as Stick

        if (!stick) {
            return {
                payload: undefined,
                statusCode: HttpStatuses.NOT_FOUND,
            }
        }

        const resultStocks = await dynamo
            .query({
                TableName: process.env.TABLE_STOCKS,
                KeyConditionExpression: "product_id = :product_id",
                ExpressionAttributeValues: { ":product_id": id },
            })
            .promise()

        const stock = resultStocks.Items?.[0] as Stock
        const stickStock = { ...stick, count: stock.count }

        return {
            payload: stickStock,
            statusCode: HttpStatuses.OK,
        }
    }

    static async createProduct(
        stickRaw: Omit<StickStock, StickStock["id"]> &
            Partial<Pick<Stick, "id">>
    ): Promise<ControllerResponse<Stick>> {
        const stickStock = {
            id: stickRaw.id || uuid4(),
            ...stickRaw,
        } as StickStock
        const { count, ...stick } = stickStock
        const stock = { count, product_id: stick.id }

        try {
            await createProductSchema.validate(stickStock)
        } catch {
            return {
                payload: null,
                statusCode: HttpStatuses.BAD_REQUEST,
            }
        }

        const result = await dynamo
            .transactWrite({
                TransactItems: [
                    {
                        Put: {
                            TableName: process.env.TABLE_PRODUCTS,
                            Item: stick,
                            ConditionExpression: "attribute_not_exists(id)",
                        },
                    },
                    {
                        Put: {
                            TableName: process.env.TABLE_STOCKS,
                            Item: stock,
                            ConditionExpression:
                                "attribute_not_exists(product_id)",
                        },
                    },
                ],
            })
            .promise()
            .then(() => {
                return { statusCode: HttpStatuses.CREATED }
            })
            .catch((error) => {
                logger.error(error)

                return { statusCode: HttpStatuses.BAD_REQUEST }
            })

        return {
            payload:
                result.statusCode === HttpStatuses.CREATED ? stick : undefined,
            statusCode: result.statusCode,
        }
    }
}
