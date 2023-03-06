import type {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Handler,
} from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts"
import {  HttpStatuses } from "../types"

const HttpStatusesMessages = {
    [HttpStatuses.NOT_FOUND]: "Not Found",
    [HttpStatuses.OK]: "OK",
    [HttpStatuses.CREATED]: "Created",
}

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

const HTTP_STATUSES_SUCCESS = [HttpStatuses.OK, HttpStatuses.CREATED]

export const formatJSONResponse = <T>(response: {
    payload?: Record<string, unknown> | Record<string, unknown>[] | T | null
    statusCode?: HttpStatuses
}) => {
    const { payload, statusCode } = response

    if (!HTTP_STATUSES_SUCCESS.includes(statusCode)) {
        const error = {
            message: HttpStatusesMessages[statusCode],
        }

        return {
            statusCode,
            headers: {
                ...CORS_HEADERS,
            },
            body: JSON.stringify(error),
        }
    }

    return {
        statusCode,
        headers: {
            ...CORS_HEADERS,
        },
        body: JSON.stringify(payload),
    }
}
