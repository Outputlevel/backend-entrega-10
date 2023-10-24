import { Router } from "express";
import { Product, Cart } from '../productManager/dao/db/index.js'
//import { messages } from "../app.js";
import { testPush } from "../app.js";
import { vehicleId } from "../app.js";
import session from "express-session";

const data = new Product() //Da de alta mi constructor
const carts = new Cart()

let arrProps = null

//get all products
export const getallProducts =  async (req, res) => {
    try {
        if(typeof(vehicleId) === 'object'){
            console.log("existe")
            return
        }
        const limit = req.query.limit;
        const page = req.query.limit
        const startIndex = (page - 1)*limit
        const endIndex = page * limit
        
        let vehicles = await data.getProducts()
      
        arrProps = {
            title: "Vechicles",
            style: "style.css",
            vehicles: vehicles,
            user: req.session.user, //datos usuario y rol de usuario
            cartId: req.session.user.cart
        }
        //arrProps.vehicles.userCart = arrProps.user.cart //conecta carrito de usuario a array de vehiculos
        console.log("ggg",vehicles)
        if(arrProps.user.role ==='admin'){
            console.log('views, found admin', arrProps.user)
            arrProps.admin = true
        }
        if (!limit) {
            //console.log(vehicles)
            return res.render('home', arrProps)
        }
        //Trae objetos por numero de limite
        const arrLimit = vehicles.splice(0, limit);
        arrProps.vehicles = arrLimit
        res.status(200).render('home', arrProps).send("Lista de vehiculos");
        
    } catch (err) {
        console.error(err)
        return []
    }
};

//single product by id
export const singleProductById = async (req, res) => {
    try {
        const idParam = req.params.idVehicle;
        const limit = req.query.limit;
        const vehicles = await data.getProductById(idParam)
        console.log(idParam)
        arrProps = {
            title: "Vechicles",
            style: "style.css",
            vehicles: vehicles
        }

        if (!limit) {
            console.log(vehicles)
            return res.render('single', arrProps)
        }
        //Trae objetos por numero de limite
        const arrLimit = vehicles.splice(0, limit);
        res.status(200).render('single', vehicles).send({arrLimit});
        
    } catch (err) {
        console.error(err)
        return []
    }
};
//realtimeViews
export const realtimeViews = async (req, res) => {
    try {
        const limit = req.query.limit;
        const vehicles = await data.getProducts()
        console.log(">>!", testPush )
        console.log(">>?", vehicleId.vehicleId )
        if(vehicleId){
            //arrProps = vehicleId
            const findVehicle = await data.deleteProductById(vehicleId)
            const newArr = await data.getProducts()
            arrProps = {
                title: "Vechicles",
                style: "style.css",
                vehicles: newArr
            }
            console.log("vehiculo borrado", arrProps)
            return res.render('web', arrProps)
        }
        arrProps = testPush
        
        console.log(arrProps)

        if(!arrProps.length){
            console.log(">>>11", arrProps )
            arrProps = {
                title: "Vechicles",
                style: "style.css",
                vehicles: vehicles
            }
            return res.render('web', arrProps)
        }

        const arrKeys = testPush[0]
        const newVehicle = await data.addProduct(arrKeys.title, arrKeys.description, arrKeys.price, arrKeys.code, arrKeys.stock, arrKeys.category, arrKeys.thumbnails)
        const newData = await data.getProducts()

        if (!limit) {
  
            arrProps = {
            title: "Vechicles",
            style: "style.css",
            vehicles: newData
              
        }
            console.log(vehicles)
            return res.render('web', arrProps)
        }
        //Trae objetos por numero de limite
        const arrLimit = vehicles.splice(0, limit);
        res.status(200).render('web', vehicles).send({arrLimit});
        
    } catch (err) {
        console.error(err)
        return []
    }
};
//chat
export const chat = async (req, res) => {
    try {
        //const limit = req.query.limit;
        const vehicles = await data.getProducts()
        arrProps = {
            title: "Chat",
            style: "style.css",
            vehicles: vehicles
        }
        console.log(vehicles)
        return res.render('chat', arrProps)        
    } catch (err) {
        console.error(err)
        return []
    }
};
//cart by id
export const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await carts.getCartById(cartId)
        /* let allProducts = await data.getProducts()
        let products = allProducts.find(p=>p.carts.cart == "6502b876d911b1e21f0b42bb") */
        arrProps = {
            title: "cart",
            style: "style.css",
            cart: cart,
            products: cart.products,
            cartEmpty: true
        }
        if(arrProps.products.length > 0){
            console.log('views, has products')
            arrProps.cartEmpty = false
        }
        return res.render('cart', arrProps)
    } catch (err) {
        console.error(err)
        return []
    }
};


//Session---------
export const getsession = (req, res) => {
    let username = req.session.user ? req.session.user : '';
    if (req.session.counter) {
        req.session.counter++;
        res.send(`${username} Visitaste el sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send(`Bienvenido ${username}!`);
    }
};
//login
export const loginView = async (req, res) => {
    try {
       //
       arrProps = {
           title: "Login",
           style: "style.css",
           loginFailed: req.session.loginFailed ?? false,
           registerSuccess: req.session.registerSuccess ?? false
       }
       res.status(200).render('login', arrProps);
       
   } catch (err) {
       console.error(err)
       return []
   }
};
//register
export const registerView = async (req, res) => {
    try {
        arrProps = {
            title: "Register",
            style: "style.css",
            registerFailed: req.session.registerFailed ?? false
        }
        res.status(200).render('register', arrProps);
        
    } catch (err) {
        console.error(err)
        return []
    }
};
//profile
export const profileView = async (req, res) => {
    try {
        //const userId = req.params.uid;
        //let data = {userId}
        //console.log(data)
        arrProps = {
            title: "Profile",
            style: "style.css",
            user: req.session.user
        }
        res.status(200).render('profile', arrProps);
        
    } catch (err) {
        console.error(err)
        return []
    }
};
//logout
export const logout = (req, res) => {
    req.session.destroy( error => {
        if (!error) res.send('Logout ok!');
        else res.send({status: 'Logout ERROR', body: error});
    });
};