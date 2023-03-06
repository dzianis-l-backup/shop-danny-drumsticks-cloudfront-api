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
    statusCode: 404
}
