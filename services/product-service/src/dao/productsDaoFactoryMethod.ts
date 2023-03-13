import { ProductsDaoDynamoDb } from "./productsDaoDynamoDb"
import { ProductsDaoMysql } from "./productsDaoMysql"

export const productsDaoFactoryMethod = (db: "dynamodb" | "mysql") => {
    if (db === "dynamodb") {
        ProductsDaoDynamoDb.init()

        return ProductsDaoDynamoDb
    }

    if (db === "mysql") {
        ProductsDaoMysql.init()

        return ProductsDaoMysql
    }

    throw new Error(`database ${db} is not currently supported`)
}
