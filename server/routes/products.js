const express = require('express')
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication')
const Product = require('../models/Product')
const  app = express()


app.get('/products', verifyToken, (req, res) => {
    // get all
    let from = req.query.from || 0
    from = Number(from)
    
    let limit = req.query.limit || 100
    limit = Number(limit)

    Product.find({})
    .sort('name')
    .populate('category_id', 'name')
    .populate('user_id', 'name email')
    .skip(from)
    .limit(limit)
    .exec((err, products) => {

        if (err) 
            return res.status(500).json({
                ok: false,
                err
            })
        
        res.json({
            ok: true,
            products,
        })
    })
})

app.get('/products/:id', verifyToken, (req, res) => {
    // mostrar unico producto
    const _id = req.params.id

    Product.findById({ _id })
    .populate('category_id', 'name')
    .populate('user_id', 'name email')
    .exec((err, productDB) => {

        if (err) 
            return res.status(500).json({
            ok: false,
            err
        })

        if (!productDB) 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        
        res.json({
            ok: true,
            product: productDB
        })
    })
})

app.get('/products/search/:term', verifyToken, (req, res) => {

    let term = req.params.term

    let regex = new RegExp(term, 'i')

    Product.find({ name: regex })
    .populate('category_id', 'name')
    .exec( (err, products) => {
        if (err) 
            return res.status(500).json({
                ok: false,
                err
            })
        
        res.json({
            ok: true,
            products,
        })
    })
})

app.post('/products', verifyToken, (req, res) => {
    // crear producto, el id del usuario esta en el token
    let body = req.body
    
    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category_id: body.category_id,
        user_id: req.user._id,
    })

    Product.create(product, (err, productDB) => {
        if (err) 
            return res.status(500).json({
                ok: false,
                err
            })
        if (!productDB) 
            return res.status(400).json({
                ok: false,
                err
            })

        
        res.status(201).json({
            ok: true,
            product: productDB,
        })
    })
})

app.put('/products/:id', verifyToken, (req, res) => {
    // editar producto, nombre
    let id = req.params.id
    let body = req.body

    Product.findByIdAndUpdate( id, body,
        { new: true, 
          runValidators: true,
          context: 'query'}, 
        (err, productDB) => {

        if (err) 
            return res.status(500).json({
                ok: false,
                err
            })
        if (!productDB) 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            })

        res.json({
            ok: true,
            product: productDB,
        })
    })
})

app.delete('/products/:id', verifyToken, (req, res) => {
    // eliminar producto > cambiando el estado de si esta disponible y solo un rol administrador
    let id = req.params.id

    let changeState = {
        available: false
    }

    Product.findByIdAndUpdate( id, changeState, { new: true }, (err, productDB) => {
        if (err) 
            return res.status(500).json({
            ok: false,
            err
        })

        if (!productDB) 
        return res.status(400).json({
            ok: false,
            err: {
                message: 'ID no existe'
            }
        })

        res.json({
            ok: true,
            product: productDB,
            message: 'Producto borrado'
        })
    })
})






module.exports = app
