import { SQSEvent, Callback, Context } from "aws-lambda"

import { logger } from "@libs/logger"
import { HttpStatusesSuccess, StickStockRaw } from "src/types"
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
    context: Context,
    callback: Callback
) => {
    logger.log("event", event)
    logger.log("context", context)

    const records = event.Records.map(refineRecordBody)
    const response = await ProductsController.catalogBatchProcess(
        records as StickStockRaw[]
    )
    const successStatuses = Object.values(HttpStatusesSuccess) as number[]

    const responseFailure = response.find(
        (response) => !successStatuses.includes(response.statusCode)
    )

    callback(null, {
        statusCode: responseFailure
            ? responseFailure.statusCode
            : response[0].statusCode,
        payload: response,
    })
}
