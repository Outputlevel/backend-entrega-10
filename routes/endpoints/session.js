import {Router} from 'express';
import UserService from '../../sevices/userService.js'


const router = Router();
const US = new UserService();

router.post("/register", async (req, res) => {
    try {
        await US.createUser(req.body);
        req.session.registerSuccess = true;
        res.redirect("/views/login");
    } catch (error) {
        req.session.registerFailed = true;
        res.redirect("/views/register");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("hi",req.body)
        //console.log("hi",req.body)
        const test1 = "rix.mtz@gmail.com"
        const test2 = "1234"
        //const { first_name, last_name, age } = await US.login(email, password);
        const { first_name, last_name, age } = await US.login(test1, test2);

        req.session.user = {first_name, last_name, email, age};
        console.log("here",req.session.user)
        req.session.loginFailed = false;
        res.redirect("/views/profile");
    } catch (error) {
        req.session.loginFailed = true;
        req.session.registerSuccess = false;
        res.redirect("/views/login");
        
    }
});

router.get("/logout",  (req, res) => {
    req.session.destroy( error => {
        if (!error) res.redirect("/views/login");
        else res.send({status: 'Logout ERROR', body: error});
    });
});

export default router;