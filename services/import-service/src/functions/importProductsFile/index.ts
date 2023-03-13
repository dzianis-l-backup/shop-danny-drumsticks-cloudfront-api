import { HttpStatuses } from "@const/index"
import { handlerPath } from "@libs/handler-resolver"

export default {
    handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
    events: [
        {
            http: {
                method: "get",
                path: "import",
                cors: true,
                request: {
                    parameters: {
                        querystrings: {
                            name: true,
                        },
                    },
                },
                responses: {
                    [HttpStatuses.Ok]: {
                        description: "OK",
                        bodyType: "string",
                    },
                    [HttpStatuses.BadRequest]: {
                        description: "Not Found",
                        bodyType: undefined,
                    },
                    [HttpStatuses.InternalServerError]: {
                        description: "Internal Server Error",
                        bodyType: undefined,
                    },
                },
            },
        },
    ],
}
