import mongoose from "mongoose"

const vehiclesCollection = 'vehicles'

const vehiclesSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    description: String,
    price: Number,
    code: {
        type:String,
        unique:true 
    },
    category: String,
    status: Boolean,
    thumbnails: String,
    carts: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts'
                }
            }
        ],
        default: []
    },
    stock: String
})

export const vehiclesModel = mongoose.model(vehiclesCollection, vehiclesSchema)