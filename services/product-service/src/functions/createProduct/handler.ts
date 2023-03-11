import { formatJSONResponse } from "@libs/api-gateway"
import { ProductsController } from "@controllers/productsController"
import { StickStock } from "src/types"
import { middyfyPost } from "@libs/lambda"

export const createProductHandler = async ({
    body,
}: {
    body: Omit<StickStock, StickStock["id"]>
}) => {
    const { payload: stick, statusCode } =
        await ProductsController.createProduct(body)

    return formatJSONResponse({ payload: stick, statusCode })
}

export const createProduct = middyfyPost(createProductHandler)
