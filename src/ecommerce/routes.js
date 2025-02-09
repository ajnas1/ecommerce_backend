import { Router } from "express";
import controller from "./controller.js";
import db from "../../db.js";
import userMiddleware from "../../middleware/users.js";

const router = Router();

router.post('/sign-up',userMiddleware.validateRegister, controller.addUser);

router.post('/login', controller.checkUser);

router.get('/secret-route', (req, res,next) => {
    res.send('This is the secret content. Only logged in users can see that!');
});

router.post('/add-product', controller.addProduct);

router.get('/get-products', controller.getProducts);

router.post('/generate-otp', controller.generateOTP);

router.post('/verify-otp', controller.verifyOTP)

export default router;