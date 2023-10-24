import fs from 'fs';

const id = 0
let products = []
let carts = []
let productsFiltered = []
let path = "./productManager/dao/fs/products/data.json" //ruta de archivo JSON para ser usado como variable
let cartPath = "./productManager/dao/fs/carts/carts.json"
let message

export class Product {
    constructor (title, description, price, code, stock, category, thumbnails) {
        this.title = title
        this.description = description
        this.price = price
        this.code = code
        this.stock = stock
        this.status = true
        this.thumbnails = thumbnails
        this.category = category
        this.id = products.length + 1
 
    }
    //Create new folder in directory    
    async createFolder(){
        try {
          const folderExist = fs.existsSync('./products'); 
          if(!folderExist){ //Valida si folder existe para finalizar promesa
            await fs.promises.mkdir('./products');
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
    async findProducts() {
        try {
            const getArr = await fs.promises.readFile(path, "utf-8");
            return JSON.parse(getArr); //Parse objects
        } catch (error) {
            console.error(error);
            return [];
        }
    } 

    //Method to print current objects in console
    async getProducts() {
        try {
            const getArr = await this.findProducts()
            return getArr
        } catch (error) {
            console.error(error);
            return [];
        }
    } 

   async addProduct(title, description, price, code, stock, category, thumbnails) {
    let product = new Product(title, description, price, code, stock, category, thumbnails)
        try {
            const products = await this.findProducts()
            product.id = products.length + 1
            productsFiltered = products.find(p => {
                return p.code == code
            })
            //Validacion si Code NO existe
            if(!productsFiltered) {
                console.log("Producto a agregar", product)
                products.push(product)
                await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"))
                //console.log("Producto creado correctamente!")
                message = "Producto creado correctamente!"
                return message
            }
            console.error("Producto NO agregado", product)
            message = "Codigo ya existe, intente de nuevo!"
            return message  
        } catch (err) {
            console.error(err)
            return []
        }
   }
    //Actualizacion de producto, busqueda por Code
    async updateProduct(title, description, price, code, stock, category, thumbnails, id) {
        let product = new Product(title, description, price, code, stock, category, thumbnails)
        const intId = parseInt(id)
        product.id = intId
        try {
            const products = await this.findProducts()
            //Encuentra ID para mostrar en consola producto eliminado
            productsFiltered = products.find(p => {
                return p.id === product.id
            })
            console.log(productsFiltered)
            if(productsFiltered) {
                console.log(`Old:`, productsFiltered)
                console.log(`Updated:`, product)
                
                //Encuentra productos que no tienen mismo id, esos se imprimiran, actualizando el producto
                let newArr = products.filter(p => {
                    return p.id !== product.id
                })
                newArr.push(product)
                await fs.promises.writeFile(path, JSON.stringify(newArr, null, "\t"))
                message = "Producto actualizado"
                return message
            }
            return 
            
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
            productsFiltered = products.find(p => {
                return p.id == id
            })
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
            const products = await this.findProducts()
            //Encuentra ID para mostrar en consola producto eliminado
            productsFiltered = products.find(p => {
                return p.id === id
            })
            console.log(`Deleted by ID: ${id}`, productsFiltered)
            //Encuentra productos que no tienen mismo ID, esos se imprimiran, eliminando el primer objeto
            productsFiltered = products.filter(p => {
                return p.id !== id
            })
            await fs.promises.writeFile(path, JSON.stringify(productsFiltered, null, "\t"))
            message = `Vehiculo eliminado correctamente: ${id}`
            return message
             
        } catch (err) {
            console.error(err)
            return []
        }  
    }
    //Elimina todos los productos
    async deleteAll() {
        const products = await this.findProducts()
        console.log("Products Deleted:", products)
        const newArr = []
        await fs.promises.writeFile(path, JSON.stringify(newArr, null, "\t"))

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
            const getArr = await fs.promises.readFile(cartPath, "utf-8");
            return JSON.parse(getArr); //Parse objects
        } catch (error) {
            console.error(error);
            return [];
        }
    } 

    async createCart() {
        try {
            const carts = await this.getCarts()
            let cart = {id: carts.length + 1, products: []}
            carts.push(cart)
            await fs.promises.writeFile(cartPath, JSON.stringify(carts, null, "\t"))
            console.log("Carrito creado correctamente!")
            message = "Carrito creado correctamente!"
            return message
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
            const productArr = await this.productClass.getProductById(productId)
            const getCart =  await this.getCartById(cartId)
            if(!getCart || !productArr){
                message = "carrito o producto no existen"
                console.error(message)
                return message
            }

            //Prepara productos para agregar al carrito
            const getQty = getCart.products.find( e => e.productId == productArr.id)
            if(!getQty){
                getCart.products.push({productId: productArr.id, quantity: 1})
                message = `Nuevo producto agregado a carrito. ID: ${getCart.id}`
                return message
            }
            const newArr = getCart.products.filter( e => e.productId != productArr.id)

            //Empuja el array con producto agregado al carrito
            newArr.push({productId: getQty.productId, quantity: getQty.quantity + 1})
            getCart.products = newArr
            console.log("id", getCart.id)

            //Actualizacion de carritos, preparando para sobrescribir JSON
            const getCarts = await this.getCarts()
            const cartsFiltered = getCarts.filter( e => e.id !== getCart.id)
            cartsFiltered.push(getCart)

            //Sobrescribe JSON
            await fs.promises.writeFile(cartPath, JSON.stringify(cartsFiltered, null, "\t"))
            message = `Carrito actualizado. ID: ${getCart.id}`
            return message
            
        } catch (err) {
            console.error(err)
            return []
        } 
   }

    //Encuentra producto por ID
    async getCartById(id) {
        let cartsFiltered = []
        try {
            const products = await this.findCartProducts()
            cartsFiltered = products.find(p => {
                return p.id == id
            })
            if(!cartsFiltered){
                message="carrito no encontrado"
                return
            }
            console.log(`Cart by ID: ${id}`, cartsFiltered)
            return cartsFiltered 
        } catch (err) {
            console.error(err)
            return []
        }  
    } 
    //Elminia producto por ID
    async deleteCartById(id) {
        try {
            const cart = await this.findCartProducts()
            //Encuentra ID para mostrar en consola producto eliminado
            productsFiltered = cart.find(p => {
                return p.id === id
            })
            if(!productsFiltered){
                console.error("Carrito no existe")
                message = "Carrito no existe"
                return "Carrito no existe"
            }
            console.log(`Deleted by ID: ${id}`, productsFiltered)
            //Encuentra productos que no tienen mismo ID, esos se imprimiran, eliminando el primer objeto
            productsFiltered = products.filter(p => {
                return p.id !== id
            })
            await fs.promises.writeFile(cartPath, JSON.stringify(productsFiltered, null, "\t"))
             
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