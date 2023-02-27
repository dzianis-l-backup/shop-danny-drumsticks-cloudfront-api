import { formatJSONResponse } from "@libs/api-gateway"
import { ProductsController } from "@controllers/productsController"

export const getProductsList = async () => {
    const sticks = await ProductsController.getProductsList()

    return formatJSONResponse(sticks)
}
