import { formatJSONResponse } from "@libs/api-gateway"
import { ProductsController } from "@controllers/productsController"
import { middyfyGet } from "@libs/lambda"

export const getProductsListHandler = async () => {
    const { payload, statusCode } = await ProductsController.getProductsList()

    return formatJSONResponse({ payload, statusCode })
}

export const getProductsList = middyfyGet(getProductsListHandler)
