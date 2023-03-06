import { handlerPath } from "@libs/handler-resolver"

export default {
    handler: `${handlerPath(__dirname)}/handler.createProduct`,
    events: [
        {
            http: {
                method: "post",
                path: "products",
                cors: true,
                responses: {
                    201: {
                        description: "Created",
                        bodyType: "StickStock",
                    },
                },
            },
        },
    ],
}
