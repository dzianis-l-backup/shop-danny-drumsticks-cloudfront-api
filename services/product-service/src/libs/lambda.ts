import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import { errorMiddleware } from "./errorMiddleware"
import { loggingMiddleware } from "./loggingMiddleware"

export const middyfyPost = (handler: any) => {
    return middy(errorMiddleware(loggingMiddleware(handler))).use(
        middyJsonBodyParser()
    )
}

export const middyfyGet = (handler: any) => {
    return middy(errorMiddleware(loggingMiddleware(handler)))
}
