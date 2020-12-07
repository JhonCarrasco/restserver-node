

// ========================================
// PORT
// ========================================
process.env.PORT = process.env.PORT || 3000


// ========================================
// ENVIRONMENT
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ========================================
// TOKEN EXPIRATION
// ========================================
// 60 * 60 * 24 * 30 => 30 days
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30

// ========================================
// AUTHENTICATION SEED
// ========================================
process.env.SEED = process.env.SEED || 'my-secret'

// ========================================
// GOOGLE CLIENT ID 
// ========================================
process.env.CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE || '526901051951-48okpd7k5cserbpmltt880i10rsnl5sd.apps.googleusercontent.com'

// ========================================
// DATA BASE
// ========================================
let urlDB

if ( process.env.NODE_ENV === 'dev' )
    urlDB = 'mongodb://localhost:27017/cafe'
else
    urlDB = process.env.MONGO_URI

process.env.URLDB = urlDB