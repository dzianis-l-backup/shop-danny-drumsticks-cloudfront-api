import type {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Handler,
} from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts"
import { ErrorNotFound } from "../types"

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

const STATUS_CODE_OK = 200

export const formatJSONResponse = <T>(response: {
    payload?: Record<string, unknown> | Record<string, unknown>[] | T | null
    error?: ErrorNotFound
}) => {
    const { payload, error } = response

    if (error) {
        const { statusCode, ...errorBody } = error

        return {
            statusCode,
            headers: {
                ...CORS_HEADERS,
            },
            body: JSON.stringify(errorBody),
        }
    }

    return {
        statusCode: STATUS_CODE_OK,
        headers: {
            ...CORS_HEADERS,
        },
        body: JSON.stringify(payload),
    }
}
