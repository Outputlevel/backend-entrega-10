import passport from 'passport';
import local from 'passport-local';
import userModel from '../productManager/dao/models/users.js';
import { createHash, isValidPassword } from '../utils/functionsUtil.js';

const localStratergy = local.Strategy;
const initializatePassport = () => {
    passport.use('register', new localStratergy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
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

                const newUser = {first_name, last_name, email, age, role:req.body.role, password: createHash(password)};
                let result = await userModel.create(newUser);

                return done(null, result);
            } catch (error) {
                req.session.registerFailed = true;
                return done("Error al registrar usuario: " + error);
            }
        }
    ))

    passport.use('login', new localStratergy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({email: username});
                if (!user) {
                    console.log('User does not exist');
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