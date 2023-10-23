import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';

import routerProducts from './routes/endpoints/products.js'
import routerCart from './routes/endpoints/cart.js'
import routerSession from './routes/endpoints/session.js'
import viewsRouter from './routes/views/views.js';
import handlebars from 'express-handlebars';
import __dirname from './utils/utils.js';
import initializatePassport from './config/passportConfig.js';


import { Server } from 'socket.io';
import { Cart } from "./productManager/dao/db/index.js";

export const messages = [];
export let testPush = [] //Prepara props para handlebars
export let vehicleId 

const app = express();

/////////Mongo DB/////////
const uri = "mongodb+srv://outputlevel10:KnneXOY0gNm7WAjk@cardealer.mkbx3tp.mongodb.net/carDealer?retryWrites=true&w=majority"
mongoose.connect(uri)

app.use(express.json());
//app.use(bodyParser.json({strict:true}));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({
     store: MongoStore.create({
         mongoUrl: uri,
         mongoOptions: { useUnifiedTopology: true },
         ttl: 1500
     }),
     secret:'Coder2023',
     resave:false,
     saveUninitialized: false
 }))

//Passport Init
initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

//Use routers
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCart);
app.use('/api/sessions', routerSession);
app.use('/views', viewsRouter);
//-------------Handlebars---------------////

//Se inicializa el motor de plantillas
app.engine('handlebars', handlebars.engine());

//Establece la ruta de las vistas
app.set('views', `${__dirname}/../views`);

//Establece el motor de renderizado
app.set('view engine', 'handlebars');

//Establece el servidor estático de archivos
app.use(express.static( __dirname + '/public'));

///----------LISTENING ON PORT-------------/////
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor arriba en el puerto ${PORT}`);
});

//-------------Web Sockets--------//////////

const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        //console.log(data);+
        socket.broadcast.emit('messageShow', data);
    });

    socket.on('addProduct', data => {
        let cart = new Cart()
        console.log("dataa", data)
        let vehicle = cart.addToCart(data.cid, data.pid)
        console.log("item added")
        socketServer.emit('addedToCart', vehicle);
    });

    socket.on('deleteVehicle', data => {
        vehicleId = data
        console.log(vehicleId)
        socketServer.emit('deletedVehicle', {vehicleId});
    });
});

/* });
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

export default (io) => {
    io.on("connection", (socket) => {

        socket.on("createProduct", async (data) => {

            try {
                await ProductService.createProduct(data);
                const products = await ProductService.getAllProducts();
                socket.emit("publishProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("deleteProduct", async (data) => {
            try {
                const result = await ProductService.deleteProduct(data.pid);
*/