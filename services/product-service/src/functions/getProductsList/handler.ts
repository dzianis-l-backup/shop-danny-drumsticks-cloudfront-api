import { formatJSONResponse } from "@libs/api-gateway"
import { ProductsController } from "@controllers/productsController"

export const getProductsList = async () => {
    const { payload, statusCode } = await ProductsController.getProductsList()

    return formatJSONResponse({ payload, statusCode })
}
