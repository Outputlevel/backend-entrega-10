import { Router } from "express";
import {getallProducts, singleProductById, realtimeViews, chat, getCartById, getsession, loginView, registerView, profileView, logout} from '../../controller/viewsController.js'
import {auth, logged} from '../../middlewares/auth.js'
import session from "express-session";

const router = Router();

let arrProps = null



//get all products
router.get('/', getallProducts);

//single product by id
router.get('/vehicle/:idVehicle', singleProductById);

router.get('/realtimeproducts/', realtimeViews);

router.get('/chat', chat);

router.get('/carts/:cid', getCartById);

//Session---------
router.get("/session", getsession);

router.get('/login', logged, loginView);

router.get('/register', registerView);

router.get('/profile', profileView);

router.get("/logout",  logout);

export default router;