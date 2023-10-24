import { Router } from "express";
import {getCarts, getCartById, createCart, deleteCart, addToCart, deleteCartById, updateCart} from '../../controller/cartController.js'

const router = Router()


///-----------------------------CART-----------------------------////

//Trae Todos los carritos
router.get('/', getCarts);

///Trae Carrito por ID
router.get('/:cartId', getCartById);

//Crear Carrito
router.post('/', createCart);

//Elimina carrito por Id
router.delete('/:cartId', deleteCart);

//add to cart
router.post('/:cartId/product/:productId', addToCart);

//Delete product from cart
router.delete('/:cartId/product/:productId', deleteCartById);

//update quantity 
router.put('/:cartId/product/:productId', updateCart);

export default router