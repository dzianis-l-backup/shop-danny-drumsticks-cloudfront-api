import { logger } from "./logger"

export const loggingMiddleware =
    <T extends (...args: any[]) => any>(handler: T) =>
    async (...args: Parameters<T>) => {
        logger.log(`Logging arguments for the ${handler.name} λ`, ...args)

        return handler(...args)
    }
