const express = require('express')
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication')
const Category = require('../models/Category')
const  app = express()


app.get('/categories', verifyToken, (req, res) => {
    // get all
    let from = req.query.from || 0
    from = Number(from)
    
    let limit = req.query.limit || 100
    limit = Number(limit)

    Category.find({})
    .sort('name')
    .populate('user_id', 'nombre email')
    .skip(from)
    .limit(limit)
    .exec((err, categories) => {

        if (err) 
            return res.status(500).json({
                ok: false,
                err
            })
        
        res.json({
            ok: true,
            categories,
        })
    })
})

app.get('/categories/:id', verifyToken, (req, res) => {
    // mostrar unica categoria
    const _id = req.params.id

    Category.findById({ _id })
    .exec((err, categoryDB) => {

        if (err) 
            return res.status(500).json({
            ok: false,
            err
        })

        if (!categoryDB) 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        
        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

app.post('/categories', verifyToken, (req, res) => {
    // crear categoria, el id del usuario esta en el token
    let body = req.body

    let category = new Category({
        name: body.name,
        user_id: req.user._id,
    })

    Category.create(category, (err, categoryDB) => {
        if (err) 
            return res.status(500).json({
                ok: false,
                err
            })
        if (!categoryDB) 
            return res.status(400).json({
                ok: false,
                err
            })

        
        res.status(201).json({
            ok: true,
            category: categoryDB,
        })
    })
})

app.put('/categories/:id', verifyToken, (req, res) => {
    // editar categoria, nombre
    let id = req.params.id
    let body = req.body

    Category.findByIdAndUpdate( id, body,
        { new: true, 
          runValidators: true,
          context: 'query'}, 
        (err, categoryDB) => {

        if (err) 
            return res.status(500).json({
                ok: false,
                err
            })
        if (!categoryDB) 
            return res.status(400).json({
                ok: false,
                err
            })

        res.json({
            ok: true,
            category: categoryDB,
        })
    })
})

app.delete('/categories/:id', [verifyToken, verifyAdminRole], (req, res) => {
    // eliminar categoria fisicamente y solo un rol administrador
    let id = req.params.id

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) 
            return res.status(500).json({
            ok: false,
            err
        })

        if (!categoryDB) 
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Categoria no encontrada'
            }
        })

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    })
})






module.exports = app
