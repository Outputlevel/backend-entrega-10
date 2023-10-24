import passport from 'passport';
import {Cart} from '../productManager/dao/db/index.js'
import local from 'passport-local';
import GitHubStrategy from 'passport-github2'
import userModel from '../productManager/dao/models/users.js';
import { createHash, isValidPassword } from '../utils/functionsUtil.js';
import 'dotenv/config'

const localStratergy = local.Strategy;
const cart = new Cart()
const initializatePassport = () => {
    //github
    passport.use(
        'github',
        new GitHubStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.SECRET_ID,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
            scope:["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile); 
            let user = await userModel.findOne({$or:[{username: profile._json.login},{email:profile.emails[0].value}]})
            if(!user) {
                const testPass = "1234"
                //crear carrito para asignar al usuario nuevo
                const newCart = await cart.createCart()
                let newUser = {
                    username: profile._json.login.toLowerCase(),
                    email: profile.emails[0].value,
                    name: profile._json.name,
                    password: createHash(testPass),
                    cart: newCart._id
                }
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(error);
        }
    }));
    //local
    passport.use('register', new localStratergy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const {  first_name, last_name, email, age } = req.body;
            //crear rol admin
            const emailAdmin = req.body.email.slice(0,5)
            const passwordAdmin = req.body.password.slice(0,5)
            if(emailAdmin === "admin" && passwordAdmin === "admin"){
                req.body.role = "admin"
                console.log("Passport, Admin Asignado")
            }
            try {
                let user = await userModel.findOne({ email: username});
                if(user) {
                    console.log('User already exists');
                    return done(null, false);
                }
                const newCart = await cart.createCart()
                const newUser = {first_name, last_name, email, age, role:req.body.role, password: createHash(password), cart:newCart};
                let result = await userModel.create(newUser);

                return done(null, result);
            } catch (error) {
                req.session.registerFailed = true;
                return done("Error al registrar usuario: " + error);
            }
        }
    ))
     //local   
    passport.use('login', new localStratergy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({$or:[{email: username},{username: username}]});
                if (!user) {
                    console.log('passport local, User does not exist');
                    return (null, false);
                }
                if(!isValidPassword(user, password)) {
                    return done (null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })
}

export default initializatePassport;