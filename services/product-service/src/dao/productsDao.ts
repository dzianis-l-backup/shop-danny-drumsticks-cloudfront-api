import { ControllerResponse, StickStock, Stick, Stock } from "../types/index"

export abstract class ProductsDao {
    init: () => void
    getProductsList: <T>() => Promise<ControllerResponse<T>>
    getProductsById: <T>(id: string) => Promise<ControllerResponse<T>>
    createProduct: <T extends StickStock>(
        stickRaw: Omit<T, T["id"]> & Partial<Pick<Stick, "id">>
    ) => Promise<ControllerResponse<T>>
    catalogBatchProcess: <T extends Stick, U extends Stock>() => Promise<
        ControllerResponse<ControllerResponse<[T, U]>[]>
    >
}
