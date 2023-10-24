import { Router } from "express";
import {getProducts,searchProducts, getProductById, addProduct, updateVehicle, deleteVehicleById,realtimeProducts} from '../../controller/productController.js'
const router = Router()
///-----------------------------PRODUCTS-----------------------------////
//Gett all products
router.get('/', getProducts);

//Search products
router.get('/search',searchProducts);

//Trae vehiculos por Id
router.get('/:idVehicle', getProductById);

//Agrega nuevo vehiculo
router.post('/', addProduct);

//Actualiza vehiculo
router.put('/:idVehicle', updateVehicle);

//Elimina vehiculo por Id
router.delete('/:idVehicle', deleteVehicleById);


///Realtime Products
router.get('/realtimeProducts', realtimeProducts);




//middleware, in progress
/* function pagination(model){
    return async (req, res, next) => {
        const limit = Number(req.query.limit);
        const page = Number(req.query.page)
        const startIndex = ((page) - 1)*limit
        const endIndex = page * limit
        //const vehicles = await data.getProducts()
        

        //pagination
        if(endIndex < model.length){
            results.next =  { page: page + 1, limit: limit }
        }
        if(startIndex > 0){
            results.previous =  { page: page - 1, limit: limit }
        }
        //operacion
        results.data = model.slice(startIndex, endIndex)

         if (!limit || !page) {
            response = new Response(code, "success", model )
            return res.status(code).send(response);
        }  
        res.pagination = results
        next()
    }
} */

export default router