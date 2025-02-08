import { query } from "express";
import db from "../../db.js";
import queries from "./queries.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const addUser = (req, res) => {
    const {username, password, email} = req.body;
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
                    db.query(queries.addUser, [username, hash, email], (error, result) => {
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


const checkUser = (req,res) => {
    const {username, password} = req.body;
    db.query(queries.checkUser, [username], (error, result) => {
        console.log(result.rows)
        if(error) {
            return res.status(400).send({message: err})
        }
        if(!result.rows || !result.rows.length) {
            console.log('err');
            console.log('err');
            return res.status(400).send({message: 'Username or password incorrect'})
        }

        bcrypt.compare(password, result.rows[0].password, (bError,bResult) => {
            if(bError) {
                return res.status(400).send({message: 'Username or password incorrect'})
            }

            if(bResult) {
                const token = jwt.sign({username: result.rows[0].username,userId: result.rows[0].id}, 'SECRETKEY',{expiresIn: '7d'});
                db.query(queries.updateLastLogin, [result.rows[0].id]);
                return res.status(200).send({message: 'Logged in!', token, user: result.rows[0]})
            }
            return res.status(400).send({message: 'Username and password incorrect!'})
        })
    })
}

const addProduct = (req, res) => {
   const {name, image, price , isStockOut}= req.body;
   db.query(queries.addProduct, [name, image, price, isStockOut], (error, result) => {
    console.log('asdnkdsaj');
    if(error) {
        res.status(400).send({message: "productadding unsuccessfull"});
    }
    res.status(201).send({message: "product added"});
   })
}

const getProducts = (req, res) => {
    db.query(queries.getProducts, (error, result) => {
        if(error) res.status(400).send({message: "unsuccessfull"});

        res.status(200).json(result.rows);
    })
}

export default { addUser , checkUser ,addProduct, getProducts}