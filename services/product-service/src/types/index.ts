export type Stick = {
    id: string
    price: number
    title: string
    description: string
}

export type ErrorProductNotFound = {
    message: string,
    statusCode: 404
}
