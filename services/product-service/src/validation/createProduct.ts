import * as yup from "yup"
import { StickStock } from "../types"

export const createProductSchema = yup.object<StickStock>({
    id: yup.string().required(),
    price: yup.number().required(),
    title: yup.string().required(),
    description: yup.string().required(),
    count: yup.number().required(),
})
