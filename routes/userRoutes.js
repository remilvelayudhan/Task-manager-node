const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// router.get('/',(req,res)=>{
//     res.json({
//         message: 'user routes is working' 
//     })
// })

router.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        const user = await User.create({name,email,password});
        res.status(201).send({
            message: 'User created successfully',
            user
        })
    }catch(err){
        res.status(400).send({
            message: err.message
        })
    }
});

router.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).send({
                message: 'User not found'
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).send({
                message: 'Invalid credentials'
            })
        }
        const token = jwt.sign({_id:user._id},process.env.JWT_SCERET_KEY);
        res.status(200).send({
            message: 'Login successful',
            token
        })
    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
});



module.exports = router;