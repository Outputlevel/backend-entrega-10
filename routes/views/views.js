import { Router } from "express";
import { Product, Cart } from '../../productManager/dao/db/index.js'
//import { messages } from "../app.js";
import { testPush } from "../../app.js";
import { vehicleId } from "../../app.js";
import {auth, logged} from '../../middlewares/auth.js'
import session from "express-session";

const router = Router();

const data = new Product() //Da de alta mi constructor
const carts = new Cart()

let arrProps = null


//get all products
router.get('/', async (req, res) => {
    try {
        if(typeof(vehicleId) === 'object'){
            console.log("existe")
            return
        }
        const limit = req.query.limit;
        const page = req.query.limit
        const startIndex = (page - 1)*limit
        const endIndex = page * limit
        
        const vehicles = await data.getProducts()
        
        arrProps = {
            title: "Vechicles",
            style: "style.css",
            vehicles: vehicles,
            user: req.session.user //datos usuario y rol de usuario
        }
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
});

//single product by id
router.get('/vehicle/:idVehicle', async (req, res) => {
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
});


router.get('/realtimeproducts/', async (req, res) => {
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
});

router.get('/chat', async (req, res) => {
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
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await carts.getCartById(cartId)
        /* let allProducts = await data.getProducts()
        let products = allProducts.find(p=>p.carts.cart == "6502b876d911b1e21f0b42bb") */
        arrProps = {
            title: "cart",
            style: "style.css",
            cart: cart,
            products: cart.products 
        }
        console.log("ggg", cart)
        return res.render('cart', arrProps)
    } catch (err) {
        console.error(err)
        return []
    }
});

//Session---------
router.get("/session", (req, res) => {
    let username = req.session.user ? req.session.user : '';
    if (req.session.counter) {
        req.session.counter++;
        res.send(`${username} Visitaste el sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send(`Bienvenido ${username}!`);
    }
});

router.get('/login', logged, async (req, res) => {
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
});

router.get('/register', async (req, res) => {
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
});

router.get('/profile', async (req, res) => {
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
});

router.get("/logout",  (req, res) => {
    req.session.destroy( error => {
        if (!error) res.send('Logout ok!');
        else res.send({status: 'Logout ERROR', body: error});
    });
});

export default router;