import { query } from "express";
import db from "../../db.js";
import queries from "./queries.js";
import bcrypt from "bcrypt";

const addUser = (req, res, next) => {
    const {username, password} = req.body;
    db.query(queries.getUser, [username], (error, result) => {
        if(result && result.length) {
            //error
            return res.send({message: 'This username is already in use!'});
        } else {
            //username not in use
            bcrypt.hash(password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).send({message: err})
                }else {
                    db.query(queries.addUser, [username, hash], (error, result) => {
                        if(err) {
                            return res.status(400).send({message: err})
                        }
                        return res.status(201).send({message: 'Registered'});
                    })
                }
            })
        }
    })
}

export default { addUser }