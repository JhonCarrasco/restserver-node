const express = require('express')
const fileUpload = require('express-fileupload')
const User = require('../models/User')
const Product = require('../models/Product')
const fs = require('fs')
const path = require('path')
const app = express()

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {
  
  let type = req.params.type
  let id = req.params.id


  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400)
    .json({
        ok: false,
        err: {
            message: 'No se ha encontrado ningún archivo'
        }
    })
  }

  // The name of the input field (i.e. "myfile") is used to retrieve the uploaded file
  let myfile = req.files.myfile
  let fileExtension = myfile.name.substr((myfile.name.lastIndexOf('.') + 1))  

  // validate type
  let validTypes = ['products', 'users']
  if (validTypes.indexOf( type ) < 0) {
    return res.status(400)
    .json({
        ok: false,
        err: {
            message: 'los tipos permitidos son: ' + validTypes.join(', '),
            ext: fileExtension
        }
    })
  }

  // authorizate ext
  let extensionValidate = ['png', 'jpg', 'gif', 'jpeg']

  if (extensionValidate.indexOf( fileExtension ) < 0 ) {
      return res.status(400).json({
          ok: false,
          err: {
              message: 'Las extensiones permitidas son: ' + extensionValidate.join(', ')
          }
      })
  }


  // change filename
  let newFileName = `${ id }-${ new Date().getMilliseconds()}.${fileExtension}`
  

  // Use the mv() method to place the file somewhere on your server
  myfile.mv(`uploads/${type}/${newFileName}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false, 
        err
      })
    
    if (type === 'users'){
        imageUser(id, res, type, newFileName)
    }
    else {
        imageProduct(id, res, type, newFileName)
    }
    
  })


})

function imageUser(id, res, type, newFileName) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(type, userDB.img)
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!userDB) {
            deleteFile(type, userDB.img)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        // delete img if exits
        deleteFile(type, userDB.img)
        
        
        userDB.img = newFileName

        userDB.save( (err, userUpdated) => {
            res.json({
                ok: true,
                user: userUpdated,
                img: newFileName
            })
        })
        
    })
}

function imageProduct(id, res, type, newFileName) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(type, productDB.img)
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            deleteFile(type, productDB.img)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        // delete img if exits
        deleteFile(type, productDB.img)
        
        
        productDB.img = newFileName

        productDB.save( (err, productUpdated) => {
            res.json({
                ok: true,
                user: productUpdated,
                img: newFileName
            })
        })
        
    })
}

function deleteFile(type, fileName) {
    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ fileName }`)
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }
}


module.exports = app