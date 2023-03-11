import { formatJSONResponse } from "@libs/api-gateway"
import { ProductsController } from "@controllers/productsController"
import { APIGatewayProxyEvent } from "aws-lambda"
import { middyfyGet } from "@libs/lambda"

export const getProductsByIdHandler = async (
    event: Partial<APIGatewayProxyEvent>
) => {
    const id = event?.pathParameters?.id
    const { payload, statusCode } = await ProductsController.getProductsById(id)

    return formatJSONResponse({ payload, statusCode })
}
export const getProductsById = middyfyGet(getProductsByIdHandler)
