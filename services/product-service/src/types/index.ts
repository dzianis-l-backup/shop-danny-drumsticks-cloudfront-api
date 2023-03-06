export type Stick = {
    id: string
    price: number
    title: string
    description: string
}

export type Sticks = Stick[]

export type ErrorNotFound = {
    message: string
    statusCode: 404
}
