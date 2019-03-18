var jwt = require('jsonwebtoken');
var config = require('../config/config');
const bcrypt = require('bcrypt');
var multer  = require('multer')
const path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', '..', '/uploads'));
    },
    filename: function (req, file, cb) {
        console.log("req.file====>>>>",file)
        console.log("file====>>>>",file)
      cb(null, file.fieldname + '-' + Date.now())
    }
})
   
var upload = multer({ storage: storage })


const response = (res, responseCode, responseMessage, result)=>{
    
    return res.status(responseCode).json({
        responseCode,
        responseMessage,
        result
    })
}

const createToken = (data)=>{
    return new Promise((resolve, reject)=>{            
        jwt.sign(data, config.PRIVATE_KEY, { expiresIn: 60 * 60 }, (err, token)=>{
            if(err)
                reject(err)
            else
                resolve(token)
        })
    })
}

const verifyToken = (token)=>{
    return new Promise((resolve, reject)=>{
        jwt.verify(token, config.PRIVATE_KEY, (err, decode)=>{
            if(err)
                reject(err)
            else
                resolve(decode)
        })
    })
}

const createHash = (myPlaintextPassword)=>{
    return new Promise((resolve, reject)=>{
        bcrypt.hash(myPlaintextPassword, config.saltRounds, function(err, hash) {
            if(err)
                reject(err)
            else
                resolve(hash)
          });
    })
}

const compareHash = (myPlaintextPassword, hash)=>{
    return new Promise((resolve, reject)=>{
        bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
            if(err)
                reject(err)
            else
                resolve(res)
        });
    })
}

const generateOTP = ()=>{
    return Math.floor(100000 + Math.random() * 900000);
}

const uploadFile = (req, res, next)=>{
    upload.fields([{ name: 'profilePic', maxCount: 1 }])(req, res, next);
}

module.exports = {
    response,
    createToken,
    verifyToken,
    createHash,
    compareHash,
    generateOTP,
    uploadFile
}