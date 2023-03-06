import { formatJSONResponse } from "@libs/api-gateway"
import { ProductsController } from "@controllers/productsController"

export const getProductsById = async (event) => {
    const id = event?.pathParameters?.id
    const [stick, error] = await ProductsController.getProductsById(id)

    return formatJSONResponse({ payload: stick, error })
}
