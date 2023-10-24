import fs from 'fs';
import { vehiclesModel } from '../models/vehicles.js';
import { cartsModel } from '../models/carts.js';
//import {run, uri, client} from '../../../mongodb.js'

const id = 0
let products = []
let carts = []
let productsFiltered = []
//let path = "./productManager/dao/fs/products/data.json" //ruta de archivo JSON para ser usado como variable
//let cartPath = "./productManager/dao/fs/carts/carts.json"
let message

export class Product {
    //Constructor eliminado 
    async findProducts() {
            try {
                const getArr = await vehiclesModel.find().lean() //elimitated populate for easier queries .populate('carts.cart')
                return getArr; //Parse objects
            } catch (error) {
                console.error(error);
                return [];
            }
        } 
     
    //Method to print current objects in console
    async getProducts() {
        try {
            const getArr = await this.findProducts()
            console.log(getArr)
            return getArr
        } catch (error) {
            console.error(error);
            return [];
        }
    } 

    async searchProducts(params){
        try{
            for(let item of Object.keys(params)) {
                params[item] = {$regex: new RegExp(params[item], 'i')} // i for case insensitive, object value to retrieve object value from params, added regex for aproximation
            }
            console.log("params",params)
            let vehicles = await vehiclesModel.find(params)
            console.log(vehicles)
            if(vehicles){
                return vehicles
            }
            return
        } catch (error) {
            console.error(error);
            return [];
        }
        
    }

   async addProduct(productData) {
        try {
            const products = await this.findProducts()
            productsFiltered = products.find(p => {
                return p.code == productData.code
            })
            console.log("Producto a agregar", productsFiltered)
            //Validacion si Code NO existe
            if(!productsFiltered) {
                console.log("Producto a agregar", productData)
                let newProduct = await vehiclesModel.create(productData)
                return newProduct
            }
            console.error("Producto NO agregado", productData)
            //message = {status: 403, message:"Codigo ya existe, intente de nuevo!"}
            return   
        } catch (err) {
            console.error(err)
            return []
        }
   }
    //Actualizacion de producto, busqueda por Code
    async updateProduct(id, product) {
        //let product = new Product(title, description, price, code, stock, category, thumbnails)
        try {
            if(typeof(id) === 'object'){
                product.carts.push(id)
                let productArr = await vehiclesModel.updateOne({_id:product._id}, product)
                console.log("testt", productArr)
                return productArr
            }      
            let productArr = await this.getProductById(id)        
            if(!productArr){
            console.log(`Producto NO encontrado by ID: ${id}`)
            //message = {status: 403, message: "Producto no encontrado"}
            return            
        }  
            productArr = await vehiclesModel.updateOne({_id:id}, product)
           // message = {status: 201, message: "Producto Actualizado", product}
            return productArr
        } catch (err) {
            console.error(err)
            return []
        }  
    } 
    //Encuentra producto por ID
    async getProductById(id) {
        let productsFiltered = []
        try {
            const products = await this.findProducts()
            console.log(products)
            productsFiltered = products.find(p => {
                return p._id == id
            })
            console.log(productsFiltered)
            if(productsFiltered) {
                console.log(`Filtered by ID: ${id}`, productsFiltered)
                return productsFiltered
            }
            console.log(`Producto NO encontrado by ID: ${id}`)
            return  
        } catch (err) {
            console.error(err)
            return []
        }  
    } 
    //Elminia producto por ID
    async deleteProductById(id) {
        try {
            const products = await this.getProductById(id)
            console.log(products)
            if(products){
                //Borra documento en mongodb
                await vehiclesModel.deleteOne(products)
                //message = `Vehiculo eliminado correctamente: ${id}`
                return products
            }
            return
        } catch (err) {
            console.error(err)
            return []
        }  
    }
    //Elimina todos los productos
    async deleteAll(secretCode) {
        if(secretCode === 'destroy'){
            console.log("bye bye")
            message = `Documentos borrados`
            return message
        }
        
        /* const products = await this.findProducts()
        console.log("Products Deleted:", products)
        const newArr = []
        await vehiclesModel.deleteMany(products) */

    }
 }

/////////////////-----------------------------------CARTS------------------------------///////////////////////////////

export class Cart {
    constructor (id, productArr) {
        this.productClass = new Product()
 
    }
    //Create new folder in directory    
    async createFolder(){
        try {
          const folderExist = fs.existsSync('./productManager/carts'); 
          if(!folderExist){ //Valida si folder existe para finalizar promesa
            await fs.promises.mkdir('./productManager/carts');
             console.log("New folder added");
            return
          };
          console.log("Folder ya existe en app")
          return
        } catch (err) {
          throw new Error(err);
        };
      };

    //To distribute current objects to class methods *will NOT print in console*. Will also parse JSON  
    async findCartProducts() {
        try {
            const getArr = await cartsModel.find().lean()
            return getArr
        } catch (error) {
            console.error(error);
            return [];
        }
    } 

    async createCart() {
        try {
            console.log(carts)
            let newcart = await cartsModel.create({
                "products": []
            })
            console.log("Carrito creado correctamente!")
            //message = {status: 201, message: "Carrito creado correctamente!", newcart}
            return newcart
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    //Method to print current objects in console
    async getCarts() {
        try {
            const getArr = await this.findCartProducts()
            return getArr
        } catch (error) {
            console.error(error);
            return [];
        }
    } 

   async addToCart(cartId, productId) {
         try {
            //encuentra Carrito y producto por ID
            const getCart =  await this.getCartById(cartId)
            const productArr = await this.productClass.getProductById(productId)
            if(!getCart || !productArr){
                message = "carrito o producto no existen"
                console.error(message)
                return message
            }
            //Empuja id de carrito a Producto para referenciar.
            let cartInProduct = productArr.carts.find(item => item.cart == getCart.id) //busca y valida si id de carrito ya existe en carts:[]

            if(!cartInProduct){
                    console.log("No product found in current cart, adding")
                    await this.productClass.updateProduct({cart: getCart.id}, productArr) //no hay return para que siga corriendo la funcion
                }
            const cartQty = getCart.products.find( e => e.productId == productArr._id)
            if(!cartQty){
                getCart.products.push({productId: productArr._id, quantity: 1})
                let newProduct = await cartsModel.updateOne({_id:cartId}, getCart)
                //getCart.products.push({productId: productArr.id, quantity: 1})
                console.log(`Nuevo producto agregado a carrito. ID: ${getCart.id}`)
                return newProduct
            }
            const newArr = getCart.products.filter( e => e.productId != productArr._id) 
          
            //Empuja el array con producto agregado al carrito
            newArr.push({productId: cartQty.productId, quantity: cartQty.quantity + 1, _id: cartQty.id })           
            getCart.products = newArr
            let newProduct = await cartsModel.updateOne({_id:getCart._id}, getCart)
            console.log(`Carrito actualizado. ID: ${getCart}`)
            return newProduct
        } catch (err) {
            console.error(err)
            return []
        } 
   }
   //actualiza carrito
   async updateCart(cid, pid, quantity){
    const getCart =  await this.getCartById(cid)
    const productArr = await this.productClass.getProductById(pid)
    //Removes product from cart
    if(quantity){
        quantity.toString()
        let cartFiltered = getCart.products.filter(p=>p.productId !== pid)
        Number(quantity)
        let arrUpdate = {productId: productArr._id, quantity:quantity}
        cartFiltered.push(arrUpdate)
        getCart.products=cartFiltered
        let cartUpdated = await cartsModel.updateOne({_id:getCart._id}, getCart)
        console.log("see",getCart)
        return cartUpdated
    }
    let cartFiltered = getCart.products.filter(p=>p.productId !== pid)
    getCart.products = cartFiltered
    let cartUpdated = await cartsModel.updateOne({_id:getCart._id}, getCart)
    //Removes Cart from Product
    let productsFiltered = productArr.carts.filter(p=>p.cart != cid)
    console.log("hi",productsFiltered)
    productArr.carts = productsFiltered
    await vehiclesModel.updateOne({_id:productArr._id}, productArr)

    return cartFiltered

   }

    //Encuentra producto por ID
    async getCartById(id) {
        let cartsFiltered = []
        try {
            let cart = await this.findCartProducts()
            cartsFiltered = cart.find(p => {
                return p._id == id
            })
            if(!cartsFiltered){
                message="carrito no encontrado"
                return
            }
            console.log(`Cart by ID: ${id}`, cartsFiltered)
            //await cartsModel.deleteOne(cartsFiltered)
            return cartsFiltered 
        } catch (err) {
            console.error(err)
            return []
        }  
    } 
    //Elminia producto por ID
    async deleteCartById(id) {
        try {
            const cart = await this.getCartById(id)
            if(cart){
                await cartsModel.deleteOne(cart)
                console.log(`Deleted by ID: ${id}`, cart)
                return cart
            }
            return      
        } catch (err) {
            console.error(err)
            return []
        }  
    }
    //Elimina todos los productos
    async deleteAll() {
        const carts = await this.findCartProducts()
        console.log("Products Deleted:", carts)
        const newArr = []
        await fs.promises.writeFile(cartPath, JSON.stringify(newArr, null, "\t"))

    }
 }

export default { Product, Cart }