import {Router} from 'express';
import UserService from '../../sevices/userService.js'
import passport from 'passport';
import local from 'passport-local';


const router = Router();
const US = new UserService();

//github-login
router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/views');
});
//Local
router.post("/login",  passport.authenticate('login',{failureRedirect: '/api/sessions/failLogin'}), 
    async (req, res) => {
            if (!req.user) {
                req.session.loginFailed = true;
                //res.redirect("/views/login");
                return res.status(400).send({status: "error", error: "Invalid credentials"});
            }
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            }
            req.session.loginFailed = false;
            res.redirect("/views/");
            ///
            /* const { email, password } = req.body;
            console.log("hi",req.body)

            const test1 = "rix.mtz@gmail.com"
            const test2 = "1234"

            const { first_name, last_name, age } = await US.login(test1, test2);

            req.session.user = {first_name, last_name, email, age};
            console.log("here",req.session.user)
            req.session.loginFailed = false;
            res.redirect("/views/profile"); */
        
});

router.post("/register", passport.authenticate('register',{failureRedirect: '/api/sessions/failRegister'}),
(req, res) => {
    res.redirect("/views/login"); 
});
//Local-Fail
router.get("/failLogin", (req, res) => {
    req.session.loginFailed = true;
    console.log('/failLogin, Invalid Credentials');
    res.redirect("/views/login");
});
router.get("/failRegister", (req, res) => {
    req.session.registerFailed = true;
    console.log('Usuario no registrado');
    res.redirect("/views/register")
});
//Logout
router.get("/logout",  (req, res) => {
    req.session.destroy( error => {
        if (!error) res.redirect("/views/login");
        else res.send({status: 'Logout ERROR', body: error});
    });
});

export default router;