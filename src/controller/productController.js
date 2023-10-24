import { Product } from '../productManager/dao/db/index.js'
import {Response} from '../routes/response.js'
//Da de alta mi constructor

const data = new Product()
let response = {}
let arrProps = {}
let code = 201
let results = {}

//Gett all products
export const getProducts = async (req, res) => {
    try {
        
        const limit = Number(req.query.limit);
        const page = Number(req.query.page)
        const startIndex = ((page) - 1)*limit
        const endIndex = page * limit
        const vehicles = await data.getProducts()
        

        //pagination
        if(endIndex < vehicles.length){
            results.next =  { page: page + 1, limit: limit }
        }
        if(startIndex > 0){
            results.previous =  { page: page - 1, limit: limit }
        }
        //operacion
        results.data = vehicles.slice(startIndex, endIndex)

        
        if (!limit || !page) {
            response = new Response(code, "success", vehicles )
            return res.status(code).send(response);
        }
        //Trae objetos por numero de limite
        response = new Response(code, `success`, results )
        return res.status(code).send(response);
    } catch (err) {
        console.error(err)
        return []
    }
};

//Search products
export const searchProducts =  async (req, res) => {
    try {
        const itemParams = req.query;
        delete itemParams.page; delete itemParams.limit;
        const page = req.query.page || 0;
        const itemsPerPage = 2
        const limit = req.query.limit

        console.log(itemParams)
        if (!itemParams) {
            throw new Error('Insert filter param');
        }
        const vehicles = await data.searchProducts(itemParams)
        if(vehicles.length >= 1){
            code = 201
            response = new Response(code, "Product Found", vehicles )
            return res.status(code).send(response);
        }
        return res.status(403).send("Producto No Encontrado");
    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
};

//Trae vehiculos por Id
export const getProductById =  async (req, res) => {
    try{
        const idParam = req.params.idVehicle;
        const filteredById = await data.getProductById(idParam)
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
//Agrega nuevo vehiculo
export const addProduct = async (req, res) => {
    try {
        const productData = {
           title: req.body.title ?? 'No title',
           description: req.body.description ?? 'No description',
           price: req.body.price ?? "No price",
           code: req.body.code ?? "No code",
           category: req.body.category ?? "No category",
           thumbnails: req.body.thumbnails ?? null,
           stock: req.body.stock ?? "No stock",
           carts: []
        }
        const createProduct = await data.addProduct(productData)
        console.log(createProduct)
        if(createProduct){
            code = 201
            response = new Response(code, "Product added", createProduct )
            return res.status(code).send(response);
        }
        return res.status(403).send("Producto No Creado, prueba con otro codigo");
    } catch (err) {
        console.error(err)
        return []
    }  
};
//Actualiza vehiculo
export const updateVehicle = async (req, res) => {
    try {
        //Encuentra vehiculo por id
        const idParam = req.params.idVehicle;

        const productData = {
           title: req.body.title ?? 'No title',
           description: req.body.description ?? 'No description',
           price: req.body.price ?? "No price",
           code: req.body.code ?? "No code",
           category: req.body.category ?? "No category",
           thumbnails: req.body.thumbnails ?? null,
           stock: req.body.stock ?? "No stock"
        }

        const updatedProduct = await data.updateProduct(productData)
            if(updatedProduct) {
                code = 201
                response = new Response(code, "success", updatedProduct )
                return res.status(code).send(response);
            }
            return res.status(404).send("Producto NO Encontrado");
    } catch (err) {
        console.error(err)
        return []
    } 
    
};

//Elimina vehiculo por Id
export const deleteVehicleById = async (req, res) => {
    try{
        const idParam = req.params.idVehicle;
        const deleteProduct = await data.deleteProductById(idParam)
        code = 201
        response = new Response(code, "Product Deleted", deleteProduct )
        return res.status(code).send(response);
    } catch (err) {
        console.error(err)
        return []
    } 
};
///Realtime Products
export const realtimeProducts =  async (req, res) => {
    try {
        const limit = req.query.limit;
        const vehicles = await data.getProducts()
        code = 200
        if (!limit) {
            response = new Response(code, "Products Found", vehicles )
            return res.status(code).send(response);
        }
        //Trae objetos por numero de limite
        const arrLimit = vehicles.splice(0, limit);
        response = new Response(code, "Products Found", arrLimit )
        return res.status(code).send(response);
    } catch (err) {
        console.error(err)
        return []
    }
};