import { APIGatewayProxyEvent, Callback, Context } from "aws-lambda"

import { logger } from "@libs/logger"
import { HttpStatuses } from "src/types"

export const catalogBatchProcess = (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback
) => {
    logger.log("event", event)
    logger.log("context", context)
    logger.log("callback", callback)

    callback(null, { statusCode: HttpStatuses.OK })
}
