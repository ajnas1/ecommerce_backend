import jwt from "jsonwebtoken";

const validate = {
    validateRegister: (req, res, next) => {
        const {username, password, password_repeat} = req.body
        if (!username || username < 3) {
            return res.status(400).send({ message: 'Please enter a username with min. 3 characters' });
        }

        if (!password || password < 6) {
            return res.status(400).send({ message: 'Please enter a password with minimum 6 character' });
        }

        if (!password_repeat || password != password_repeat) {
            return res.status(400).send({message: 'Both passwords must match'})
        }

        next();
    },
    validateNewPassword: (req, res, next) => {
        const {password, password_repeat,} = req.body;
         console.log("odksklofdlfdlk,mfd");
        if (!password || password < 6) {
            return res.status(400).send({ message: 'Please enter a password with minimum 6 character' });
        }

        if (!password_repeat || password != password_repeat) {
            return res.status(400).send({message: 'Both passwords must match'})
        }

        next();
    }
}



export default validate;