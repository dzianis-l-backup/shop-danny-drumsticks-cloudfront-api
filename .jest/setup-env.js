const dotenv = require("dotenv")
const path = require("path")
const pathToEnv = path.join(__dirname, "../services/product-service/.env")

dotenv.config({ path: pathToEnv })
