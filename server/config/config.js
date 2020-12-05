

// ========================================
// PORT
// ========================================
process.env.PORT = process.env.PORT || 3000


// ========================================
// ENVIRONMENT
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ========================================
// DATA BASE
// ========================================
let urlDB

// if ( process.env.NODE_ENV === 'dev' )
//     urlDB = 'mongodb://localhost:27017/cafe'
// else
    urlDB = 'mongodb+srv://admin:Cafe.2020@cluster0.h0btw.mongodb.net/cafe'
    // urlDB = process.env.MONGO_URI

process.env.NODE_ENV = urlDB