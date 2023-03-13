import { Stock } from "../types"
import Stocks from "./stocksMock.json"

export const getStocksMock: () => Promise<Stock[]> = async () => Stocks
