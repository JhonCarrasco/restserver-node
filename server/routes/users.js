const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const User = require('../models/User')
const { estimatedDocumentCount } = require('../models/User')
const app = express()

app.get('/', function (req, res) {
    //   res.send('Hello World')
    res.json('Hello World')
})

app.get('/users', (req, res) => {
    // se considera como un rango inicial abierto, donde 'from = 5' ( [1,2,3,4,5[ -> 6,7,8...).
    // para controlar la cantidad por paginación
    let from = req.query.from || 0
    from = Number(from)
    
    let limit = req.query.limit || 5
    limit = Number(limit)

        
    User.find({ state: true }, 'name email role google state')
    .skip(from)
    .limit(limit)
    .exec((err,users) => {

        if (err) 
            return res.status(400).json({
                ok: false,
                err
            })
        
        User.collection.countDocuments({ state: true }, (err, counting) => {
            res.json({
                ok: true,
                counting,
                users,
            })
        })        
    })
})

app.post('/users', function (req, res) {
    let body = req.body

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        state: body.state,
        google: body.google,
    })

    user.save((err, userDB) => {
        if (err) 
            return res.status(400).json({
                ok: false,
                err
            })

        
        res.json({
            ok: true,
            user: userDB,
        })
    })

})

app.put('/users/:id', function (req, res) {
    let id = req.params.id
    // opciones de los atributos que se pueden modificar
    let body = _.pick(req.body, ['name','email','img','role','state'])
    // let body = req.body

    // new: true -> retorna el objeto modificado ,
    // runValidators: true -> valida las condiciones del Schema
    User.findByIdAndUpdate( id, body,        
        { new: true
        , runValidators: true 
        , context: 'query'
        }, (err, userDB) => {

        if (err) 
            return res.status(400).json({
                ok: false,
                err
            })

        res.json({
            ok: true,
            user: userDB,
        })
    })

})

app.delete('/users/:id', function (req, res) {
    let id = req.params.id
    
    let changeState = {
        state: false
    }

    //     User.findByIdAndRemove(id, (err, user) => {
    User.findByIdAndUpdate( id, changeState, { new: true }, 
        (err, userDB) => {
            if (err) 
            return res.status(400).json({
                ok: false,
                err
            })

            if (!userDB) 
            return res.status(400).json({
                ok: false,
                err: 'Usuario no encontrado'
            })

            res.json({
                ok: true,
                userDB,
            })
        })

})

module.exports = app