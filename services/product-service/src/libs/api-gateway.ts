import type {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Handler,
} from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts"
import { HttpStatuses, HttpStatusesSuccess } from "../types"

const HttpStatusesMessages = {
    [HttpStatuses.OK]: "OK",
    [HttpStatuses.NOT_FOUND]: "Not Found",
    [HttpStatuses.CREATED]: "Created",
    [HttpStatuses.BAD_REQUEST]: "Bad Request",
    [HttpStatuses.INTERNAL_SERVER_ERROR]: "Oops guess someone is gonna be fired",
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


export const formatJSONResponse = <T>(response: {
    payload?: Record<string, unknown> | Record<string, unknown>[] | T | null
    statusCode: HttpStatuses
}) => {
    const { payload, statusCode } = response

    if (!(Object.values(HttpStatusesSuccess) as number[]).includes(statusCode)) {
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
