export type Stick = {
    id: string
    price: number
    title: string
    description: string
}

export type StickStock = Stick & { count: Stock["count"] }
export type SticksStocks = StickStock[]

export type Stock = {
    product_id: string
    count: number
}

export type Sticks = Stick[]

export type ErrorNotFound = {
    message: string
    statusCode: HttpStatuses.NOT_FOUND
}

export enum HttpStatuses {
    OK = 200,
    CREATED = 201,
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
}

export enum HttpStatusesSuccess {
    OK = HttpStatuses.OK,
    CREATED = HttpStatuses.CREATED,
}

export interface StatusCode {
    statusCode: HttpStatuses
}

export interface ControllerResponse<T> extends StatusCode {
    payload: T | undefined
}

export type StickStockRaw = Omit<StickStock, "id">
