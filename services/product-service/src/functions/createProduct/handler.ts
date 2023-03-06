import { formatJSONResponse } from "@libs/api-gateway"
import { ProductsController } from "@controllers/productsController"
import { StickStock } from "src/types"
import { APIGatewayEvent } from "aws-lambda"

export const createProduct = async (event: APIGatewayEvent) => {
    const body = event.body
    const stickRaw = JSON.parse(body) as Omit<StickStock, StickStock["id"]>
    const { payload: stick, statusCode } =
        await ProductsController.createProduct(stickRaw)

    return formatJSONResponse({ payload: stick, statusCode })
}
