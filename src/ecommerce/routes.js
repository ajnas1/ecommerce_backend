import { Router } from "express";
import controller from "./controller.js";
import jwt from "jsonwebtoken";
import * as uuid from "uuid";
import db from "../../db.js";
import userMiddleware from "../../middleware/users.js";

const router = Router();

router.post('/sign-up',userMiddleware.validateRegister, controller.addUser);

router.post('/login', (req, res, next) => {});

router.get('/secret-route', (req, res,next) => {
    res.send('This is the secret content. Only logged in users can see that!');
});

export default router;