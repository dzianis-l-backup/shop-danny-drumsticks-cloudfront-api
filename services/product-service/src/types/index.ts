export type Stick = {
    id: string
    price: number
    title: string
    description: string
}

export type StickStock = Stick & { count: Stock["count"] }

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
}

export interface StatusCode {
    statusCode: HttpStatuses
}

export interface ControllerResponse<T> extends StatusCode {
    payload: T | undefined,
}
