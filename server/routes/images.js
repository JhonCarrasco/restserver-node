const express = require('express')
const fs = require('fs')
const path = require('path')
const { verifyToken, verifyTokenImage } = require('../middlewares/authentication')
const app = express()


app.get('/image/:type/:img', verifyTokenImage, (req, res) => {
    let type = req.params.type
    let img = req.params.img

    let notImagePath = path.resolve(__dirname, '../assets/no-image.jpg')

    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ img }`)

    if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage)
    }
    else {
        return res.sendFile(notImagePath)
    }

    

})

module.exports = app