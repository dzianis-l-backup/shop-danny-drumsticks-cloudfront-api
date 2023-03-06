import { Stick } from "../types"
import Products from "./productsMock.json"

export const getSticksMock: () => Promise<Stick[]> = async () => Products
