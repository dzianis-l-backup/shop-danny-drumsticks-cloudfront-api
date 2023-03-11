import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import { errorHandler } from "./errorMiddleware"

export const middyfyPost = (handler: any) => {
    return middy(errorHandler(handler)).use(middyJsonBodyParser())
}

export const middyfyGet = (handler: any) => {
    return middy(errorHandler(handler))
}
