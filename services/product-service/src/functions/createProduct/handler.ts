import { formatJSONResponse } from "@libs/api-gateway"
import { ProductsController } from "@controllers/productsController"
import { StickStock } from "src/types"
import { middyfy } from "@libs/lambda"

export const createProduct = middyfy(
    async (stickRaw: Omit<StickStock, StickStock["id"]>) => {
        const { payload: stick, statusCode } =
            await ProductsController.createProduct(stickRaw)

        return formatJSONResponse({ payload: stick, statusCode })
    }
)
