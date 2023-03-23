import { Stick, StickStock, ControllerResponse, StickStockRaw, Stock } from "../types"
import { productsDaoFactoryMethod } from "../dao/productsDaoFactoryMethod"

const dao = productsDaoFactoryMethod("dynamodb")

export abstract class ProductsController {
    static async getProductsList(): Promise<ControllerResponse<Stick[]>> {
        return dao.getProductsList()
    }

    static async getProductsById(
        id: string
    ): Promise<ControllerResponse<StickStock>> {
        return dao.getProductsById(id)
    }

    static async createProduct(
        stickRaw: Omit<StickStock, "id"> & Partial<Pick<Stick, "id">>
    ): Promise<ControllerResponse<Stick>> {
        return dao.createProduct(stickRaw)
    }

    static async catalogBatchProcess(sticksStocksRaw: StickStockRaw[]): Promise<ControllerResponse<ControllerResponse<[Stick, Stock]>[]>> {
        return dao.createBatchProduct(sticksStocksRaw)
    }
}
