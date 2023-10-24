import { Cart } from '../productManager/dao/db/index.js'
import {Response} from '../routes/response.js'

//Da de alta mi constructor
export const cart = new Cart()
let code
let response
//Trae Todos los carritos
export const getCarts = async (req, res) => {
    try {
        const limit = req.query.limit;
        const cartProducts = await cart.getCarts()
        code = 201
        if (!limit) {
            response = new Response(code, `success`, cartProducts )
            return res.status(code).send(response);
        }
        //Trae objetos por numero de limite
        const cartProductsLimit = vehicles.splice(0, limit);
        response = new Response(code, `success`, cartProductsLimit )
        return res.status(code).send(response);
    } catch (err) {
        console.error(err)
        return []
    }  
}
///Trae Carrito por ID
export const getCartById = async (req, res) => {
    try{
        const idParam = req.params.cartId;
        const filteredById = await cart.getCartById(idParam)
        if(filteredById){
            code = 201
            response = new Response(code, "Product Found", filteredById )
            return res.status(code).send(response);
        }
        return res.status(403).send("Producto No Encontrado");
    } catch (err) {
        console.error(err)
        return []
    } 
};
//Crear Carrito
export const createCart = async (req, res) => {
    try {
        const newCart = await cart.createCart()
        if(newCart){
            code = 201
            response = new Response(code, "Cart Created", newCart )
            return res.status(code).send(response);
        }
        return res.status(404).send("Producto NO Creado");
    } catch (err) {
        console.error(err)
        return []
    } 
};
//Elimina carrito por Id
export const deleteCartById = async (req, res) => {
    try{
        const idParam = req.params.cartId;
        const deleteProduct = await cart.deleteCartById(idParam)
        code = 201
        response = new Response(code, "Product Deleted", deleteProduct )
        return res.status(code).send(response);
    } catch (err) {
        console.error(err)
        return []
    } 
};
//add to cart
export const addToCart =  async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const addToCart = await cart.addToCart(cartId, productId) //agrega producto a carrito por su id
        if(addToCart){
            code = 201
            response = new Response(code, "Cart updated", addToCart )
            return res.status(code).send(response);
        }
        return res.status(404).send("Producto NO Creado");
    } catch (err) {
        console.error(err)
        return []
    } 
};
//Delete product from cart
export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const addToCart = await cart.updateCart(cartId, productId) //agrega producto a carrito por su id
        if(addToCart){
            code = 201
            response = new Response(code, "Cart updated", addToCart )
            return res.status(code).send(response);
        }
        return res.status(404).send("Producto NO Creado");
    } catch (err) {
        console.error(err)
        return []
    } 
};
//update quantity 
export const updateCart =  async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        let quantity = req.body.quantity
        const productQuantity = {
            quantity: req.body.title
         }
        const addToCart = await cart.updateCart(cartId, productId, quantity) //agrega producto a carrito por su id
        if(addToCart){
            code = 201
            response = new Response(code, "Cart updated", addToCart )
            return res.status(code).send(response);
        }
        return res.status(404).send("Producto NO Creado");
    } catch (err) {
        console.error(err)
        return []
    } 
}