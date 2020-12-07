const mongoose = require('mongoose')


let Schema = mongoose.Schema

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido'],
    },
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
})

module.exports = mongoose.model('Category', categorySchema)