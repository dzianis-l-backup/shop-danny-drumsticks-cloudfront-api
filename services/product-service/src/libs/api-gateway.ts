import type {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Handler,
} from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts"

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
    body: FromSchema<S>
}
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
    ValidatedAPIGatewayProxyEvent<S>,
    APIGatewayProxyResult
>

const CORS_HEADERS = {
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
}

export const formatJSONResponse = (
    response: Record<string, unknown> | Record<string, unknown>[] | null
) => {
    if (!response) {
        return {
            statusCode: 404,
            headers: {
                ...CORS_HEADERS,
            },
            body: null,
        }
    }

    return {
        statusCode: 200,
        headers: {
            ...CORS_HEADERS,
        },
        body: JSON.stringify(response),
    }
}
