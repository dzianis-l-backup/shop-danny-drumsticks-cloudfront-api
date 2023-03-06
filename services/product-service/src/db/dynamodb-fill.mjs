import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import AWS from "aws-sdk"
import Products from "../mocks/productsMock.json" assert { type: "json" }
import Stocks from "../mocks/stocksMock.json" assert { type: "json" }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pathToEnv = path.join(__dirname, "../../../.env")

dotenv.config({ path: pathToEnv })
console.info("For the region %s", process.env.REGION)

// Set the region
AWS.config.update({ region: process.env.REGION })

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })

ddb.listTables({ Limit: 10 }, function (err, data) {
    if (err) {
        console.log("Error", err.code)
    } else {
        console.log("Table names are ", data.TableNames)
    }
})

// Items schemas

// Products fill in
// unable the comments to execute
/* 

const productsItems = Products.map((product) => {
    return {
        TableName: process.env.TABLE_PRODUCTS,
        Item: {
            id: { S: product.id },
            title: { S: product.title },
            description: { S: product.description },
            price: {
                N: `${product.price}`,
            },
        },
    }
})


productsItems.forEach((productItem) => {
    ddb.putItem(productItem, function (err, data) {
        if (err) {
            console.log("Error", err)
        } else {
            console.log("Success", data)
        }
    })
})
*/

// Stocks fill in
// Unable the comments to execute
/*

const stocksItems = Stocks.map((stock) => {
    return {
        TableName: process.env.TABLE_STOCKS,
        Item: {
            product_id: { S: stock.product_id },
            count: { N: `${stock.count}` },
        },
    }
})

stocksItems.forEach((stockItem) => {
    ddb.putItem(stockItem, function (err, data) {
        if (err) {
            console.log("Error", err)
        } else {
            console.log("Success", data)
        }
    })
})
*/
