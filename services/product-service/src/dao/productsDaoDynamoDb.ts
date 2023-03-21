import {
    Stick,
    Stock,
    StickStock,
    HttpStatuses,
    ControllerResponse,
    StickStockRaw,
} from "../types"
import {DynamoDB} from "aws-sdk"
import { v4 as uuid4 } from "uuid"
import { createProductSchema } from "@validation/createProduct"
import { logger } from "@libs/logger"
import { ProductsDao } from "./productsDao"

let dynamodb: AWS.DynamoDB.DocumentClient
export abstract class ProductsDaoDynamoDb extends ProductsDao {
    static init(): void {
        dynamodb = new DynamoDB.DocumentClient({
            region: process.env.REGION,
        })
    }
    static async getProductsList(): Promise<ControllerResponse<Stick[]>> {
        const productsResults = await dynamodb
            .scan({
                TableName: process.env.TABLE_PRODUCTS,
            })
            .promise()

        const stocksResults = await dynamodb
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
        const resultProducts = await dynamodb
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

        const resultStocks = await dynamodb
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

        try {
            const result = await dynamodb
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
                    result.statusCode === HttpStatuses.CREATED
                        ? stick
                        : undefined,
                statusCode: result.statusCode,
            }
        } catch (error) {
            logger.error(error)

            return { statusCode: HttpStatuses.BAD_REQUEST, payload: undefined }
        }
    }

    static async createBatchProduct(
        sticksStocksRaw: StickStockRaw[]
    ): Promise<ControllerResponse<Stick>[]> {
        let controllerResponse: ControllerResponse<Stick>[] = []

        for (const stickStockRaw of sticksStocksRaw) {
            const response = await ProductsDaoDynamoDb.createProduct(
                stickStockRaw
            )

            controllerResponse.push(response)
        }

        return controllerResponse
    }
}
