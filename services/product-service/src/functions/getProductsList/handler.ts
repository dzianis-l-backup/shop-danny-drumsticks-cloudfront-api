import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway"
import { formatJSONResponse } from "@libs/api-gateway"

import schema from "./schema"
import { STICKS_MOCK } from "@mocks/products"

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
    typeof schema
> = async () => {
    return formatJSONResponse({
        sticks: STICKS_MOCK,
    })
}
