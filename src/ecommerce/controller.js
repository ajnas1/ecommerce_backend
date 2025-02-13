import { json, query } from "express";
import db from "../../db.js";
import queries from "./queries.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import paypal from "paypal-rest-sdk";


const addUser = (req, res) => {
    const { username, password, email } = req.body;
    db.query(queries.getUser, [username], (error, result) => {
        if (result && result.length) {
            //error
            return res.send({ message: 'This username is already in use!' });
        } else {
            //username not in use
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).send({ message: err })
                } else {
                    db.query(queries.addUser, [username, hash, email], (error, result) => {
                        if (err) {
                            return res.status(400).send({ message: err })
                        }
                        return res.status(201).send({ message: 'Registered' });
                    })
                }
            })
        }
    })
}


const checkUser = (req, res) => {
    const { username, password } = req.body;
    db.query(queries.checkUser, [username], (error, result) => {
        console.log(result.rows)
        if (error) {
            return res.status(400).send({ message: err })
        }
        if (!result.rows || !result.rows.length) {
            console.log('err');
            console.log('err');
            return res.status(400).send({ message: 'Username or password incorrect' })
        }

        bcrypt.compare(password, result.rows[0].password, (bError, bResult) => {
            if (bError) {
                return res.status(400).send({ message: 'Username or password incorrect' })
            }

            if (bResult) {
                const token = jwt.sign({ username: result.rows[0].username, userId: result.rows[0].id }, 'SECRETKEY', { expiresIn: '7d' });
                db.query(queries.updateLastLogin, [result.rows[0].id]);
                return res.status(200).send({ message: 'Logged in!', token, user: result.rows[0] })
            }
            return res.status(400).send({ message: 'Username and password incorrect!' })
        })
    })
}

const addProduct = (req, res) => {
    const { name, image, price, isStockOut, category } = req.body;
    db.query(queries.addProduct, [name, image, price, isStockOut, category], (error, result) => {
        console.log('asdnkdsaj');
        if (error) {
            res.status(400).send({ message: "productadding unsuccessfull" });
        }
        res.status(201).send({ message: "product added" });
    })
}

const getProducts = (req, res) => {
    db.query(queries.getProducts, (error, result) => {
        if (error) res.status(400).send({ message: "unsuccessfull" });

        res.status(200).json(result.rows);
    })
}

const generateOTP = async (req, res) => {
    const { email } = req.body;

    db.query(queries.checkEmailExists, [email], (error, result) => {
        if (error) throw error;
        if (result.rows.length) {
            const otp = otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

            try {
                //store this email and otp in postreges
                db.query(queries.addOTP, [email, otp]);
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'ajnasashkath@gmail.com',
                        pass: 'flwz gbag xvup pjza'
                    }
                });

                transporter.sendMail({
                    from: 'ajnasashkath@gmail.com',
                    to: email,
                    subject: 'OTP Verification',
                    text: `Your OTP for verification is: ${otp}`
                });
                res.status(201).json({
                    isSuccess: true,
                    message: "successfull",
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    isSuccess: false,
                    message: "Error sending OTP",
                });
            }

        } else {
            console.log('Email not exists.');
            res.status(400).json({
                isSuccess: false,
                message: "Email not exists.",
            });
        }
    });
}

const verifyOTP = (req, res) => {
    const { email, otp } = req.body;
    try {
        db.query(queries.checkOTPExists, [email, otp], (error, result) => {
            if (result.rows.length) {
                res.status(200).json({
                    isSuccess: true,
                    message: "success"
                })
            } else {
                res.status(400).json({
                    isSuccess: false,
                    message: "Invalid OTP"
                });
            }
            console.log(new Date(result.rows[0].createdat));
            console.log(Date.now());
            var createdAt = new Date(result.rows[0].createdat);
            var diff = Date.now() - createdAt.getTime();
            console.log(diff);
            var minutes = Math.round((diff / 1000) / 60);
            console.log(minutes);
            //check the created time greaterthan 1 min if true delete the column from db
            if (minutes > 1) {
                db.query(queries.deleteOTP, [email, otp]);
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: "Error verifying OTP"
        })
    }
}

paypal.configure({
    'mode': 'sandbox',  // live
    'client_id': 'ATmZwkLJcY0sU8EwPrns_nKNo8lmRzimJNM3cYbQg84TDcfLU_94M_ZR6LXKvkyciC5J9YZuUxAvkmLe',
    'client_secret': 'ELhmp8TNCpawR-_9FFZxe5l5HolQenGyqPF3OwjljoJg2N1rr5LLo97sksV-VlbyX79ZLhJr7cMGjX4v'
});
const pay = (req, res) => {
    const {name, price} = req.body;
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": name,
                    "price": price,  
                    "currency": "INR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "INR",
                "total": price
            },
            "description": "Hat for the best team ever"
        }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            console.error(error);
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    console.log('approved');
                    return res.send(`${payment.links[i].href}   ${payment.id}`);
                }
            }
            return res.status(500).send({ message: "No approval URL found" });
        }
    });
};
const success = (req, res) => {
    const payerId = req.query.payerId;
    const paymentId = req.query.paymentId;

    const execute_paymnet_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": {
                    "currency": "USD",
                    "total": "25.00"
                }
            }
        }]
    }

    paypal.payment.execute(paymentId,
        execute_paymnet_json,
        (error, payment) => {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                res.send('Success');
            }
        }
    )
}


const cancel = (req, res) => res.send('Cancelled');


const changePassword = async (req, res) => {
    const { password, email } = req.body;
   console.log(email);
    try {
       await bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).send({ message: err })
            } else {
                db.query(queries.updatePassword, [hash, email], (error, result) => {
                    console.log(result.rows);
                    if (result.rows.length) {
                        res.status(400).json({
                            isSuccess: false,
                            message: "unsuccessfull"
                        });
                    } else {
                        res.status(201).json({
                            isSuccess: true,
                            message: "success"
                        })
                    }
                });
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: "unsuccess"
        })
    }
}

export default { addUser, checkUser, addProduct, getProducts, generateOTP, verifyOTP, pay, success, cancel, changePassword }