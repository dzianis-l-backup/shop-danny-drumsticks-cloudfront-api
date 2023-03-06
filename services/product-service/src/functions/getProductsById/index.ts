import { handlerPath } from "@libs/handler-resolver"

export default {
    handler: `${handlerPath(__dirname)}/handler.getProductsById`,
    events: [
        {
            http: {
                method: "get",
                path: "products/{id}",
                cors: true,
                responses: {
                    200: {
                        description: "OK",
                        bodyType: "Stick",
                    },
                    404: {
                        description: "Not Found",
                        bodyType: "ErrorNotFound",
                    },
                },
            },
        },
    ],
}
