import mongoose from "mongoose"

const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
    products: {
        type:[
        {
            productId: { type: String, require: false, unique: true },
            quantity: { type: Number, require: false, unique: false }
        }
    ],
    default:[]
}
})

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)
