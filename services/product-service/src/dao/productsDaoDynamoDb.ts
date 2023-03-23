import {
    Stick,
    Stock,
    StickStock,
    HttpStatuses,
    ControllerResponse,
    HttpStatusesSuccess,
    StickStockRaw,
} from "../types"
import { DynamoDB } from "aws-sdk"
import { v4 as uuid4 } from "uuid"
import { createProductSchema } from "@validation/createProduct"
import { logger } from "@libs/logger"
import { ProductsDao } from "./productsDao"

const getStickAndStock = (
    stickStockRaw: StickStockRaw | StickStock
): [Stick, Stock] => {
    let id: Stick["id"] = uuid4()

    if ("id" in stickStockRaw) {
        id = stickStockRaw.id
    }

    const stickStock = {
        ...stickStockRaw,
        id,
    } as StickStock
    const { count, ...stick } = stickStock
    const stock = { count, product_id: stick.id }

    return [stick, stock]
}

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
    ): Promise<ControllerResponse<ControllerResponse<[Stick, Stock]>[]>> {
        const sticksRequests = []
        const stocksRequests = []
        const responses = []
        for (const stickStockRaw of sticksStocksRaw) {
            const [stick, stock] = getStickAndStock(stickStockRaw)

            sticksRequests.push({
                PutRequest: {
                    Item: {
                        ...stick,
                    },
                },
            })

            let paramsSticks = {
                RequestItems: {
                    [process.env.TABLE_PRODUCTS]: sticksRequests,
                },
            }

            stocksRequests.push({
                PutRequest: {
                    Item: {
                        ...stock,
                    },
                },
            })

            let paramsStocks = {
                RequestItems: {
                    [process.env.TABLE_STOCKS]: stocksRequests,
                },
            }

            try {
                await dynamodb.batchWrite(paramsSticks).promise()
                await dynamodb.batchWrite(paramsStocks).promise()

                responses.push({
                    statusCode: HttpStatuses.CREATED,
                    payload: [stick, stock] as [Stick, Stock],
                })
            } catch (error) {
                if (error) {
                    logger.error("createBatchProduct", error)
                }

                responses.push({
                    statusCode: HttpStatuses.BAD_REQUEST,
                    payload: undefined,
                })
            }
        }

        return {
            statusCode: responses.every((response) =>
                (Object.values(HttpStatusesSuccess) as number[]).includes(
                    response.statusCode
                )
            )
                ? HttpStatuses.CREATED
                : HttpStatuses.BAD_REQUEST,

            payload: responses,
        } as ControllerResponse<ControllerResponse<[Stick, Stock]>[]>
    }
}
