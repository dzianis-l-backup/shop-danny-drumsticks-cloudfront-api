import { HttpStatuses } from "src/types"
import { formatJSONResponse } from "./api-gateway"
import { logger } from "./logger"

export const errorHandler =
    <T extends (...args: any[]) => any>(handler: T) =>
    async (...args: Parameters<T>) => {
        try {
            return await Promise.resolve(handler(...args))
        } catch (error) {
            logger.error(error)

            return formatJSONResponse({
                statusCode: HttpStatuses.INTERNAL_SERVER_ERROR,
            })
        }
    }
