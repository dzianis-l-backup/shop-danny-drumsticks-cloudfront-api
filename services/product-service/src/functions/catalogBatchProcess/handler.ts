import { SQSEvent, Context } from "aws-lambda"
import { SNS } from "aws-sdk"

import { logger } from "@libs/logger"
import {
    ControllerResponse,
    HttpStatuses,
    Stick,
    StickStockRaw,
    Stock,
} from "src/types"
import { ProductsController } from "@controllers/productsController"

const refineRecordBody = (record: any) => {
    const body = JSON.parse(record.body)

    return {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        count: Number(body.count),
    }
}

export const catalogBatchProcess = async (
    event: SQSEvent,
    context: Context
) => {
    logger.log("event", event)
    logger.log("context", context)

    const sns = new SNS({ region: process.env.REGION })
    const records = event.Records.map(refineRecordBody)
    const response: ControllerResponse<ControllerResponse<[Stick, Stock]>[]> =
        await ProductsController.catalogBatchProcess(records as StickStockRaw[])

    try {
        await sns
            .publish({
                Subject: "Hey, here is the outcome to batch catalog creation",
                Message: JSON.stringify(response),
                TopicArn: process.env.SNS_TOPIC_CREATE_BATCH_PROCESS_ARN,
            })
            .promise()

        return response
    } catch (error) {
        logger.error(error)
        return { statusCode: HttpStatuses.INTERNAL_SERVER_ERROR }
    }
}
