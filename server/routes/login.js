const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const app = express()

app.post('/login', (req, res) => {

    let body = req.body

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) 
            return res.status(500).json({
                ok: false,
                err
            })

        if (!userDB) 
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) y/o contraseña incorrecto(s)'
                }
            })

        if (!bcrypt.compareSync(body.password, userDB.password))
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o (contraseña) incorrecto(s)'
                }
            })
        
        const token = jwt.sign({ 
            user: userDB }
            , process.env.SEED
            , { expiresIn: 60 * 60 * 24 * 365}) // expira en un año
        
        res.json({
            ok: true,
            user: userDB,
            token
        })
    })

})// end post


module.exports = app