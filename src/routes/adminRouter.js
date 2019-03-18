var Admin = require('../models/admin');
const common = require('../common/commonFunction');
const message = require('../common/message');
const code = require('../common/code');
const adminController = require('../controller/adminController');


const verifyToken = (req, res, ApiName)=>{
    let { accesstoken } = req.headers;
    console.log("accesstoken====>>>",accesstoken)
    common.verifyToken(accesstoken)
    .then(decode=>{
    let { _id, email } = decode;
        Admin.findById(_id).lean()
        .then(admin=>{
            req['admin'] = admin;
            adminController[ApiName](req, res);
        }, err=>{
            return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR)
        })
    }, err=>{
        return common.response(res, code.UNAUTHORIZED, message.INVALID_TOKEN)
    })
}

const login = (req, res)=>{
    console.log("req.body=====>>>>",req.body)
    let { email, password } = req.body;
    Admin.findOne({email}).lean()
    .then(admin=>{
        if(!admin)
            return common.response(res, code.KEY_MISSING, message.INVALID_CREDENTIALS);
        else{
            let { hash, _id, email } = admin;
            common.compareHash(password, hash)
            .then(passwordMatch=>{
                delete admin['hash'];
                if(passwordMatch){
                    let data = { _id, email };
                    common.createToken(data)
                    .then(token=>{
                        admin['token'] = token;
                        return common.response(res, code.EVERY_THING_IS_OK, message.LOGIN_SUCCESSFULLY, admin)
                    }, err=>{
                        return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR)
                    })
                }
                else
                    return common.response(res, code.KEY_MISSING, message.INVALID_CREDENTIALS)
            }, err=>{
                return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, err)
            })
        }
    }, err=>{
        return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, err)
    })
}

const forgotPassword = (req, res)=>{
    let { email } = req.body;
    Admin.findOne({email}).lean()
    .then(admin=>{
        if(!admin)
            return common.response(res, code.KEY_MISSING, message.EMAIL_NOT_REGISTERED);
        else{
            let otp = common.generateOTP();
            Admin.findOneAndUpdate({email}, { otp }, { new:true})
            .then(admin=>{
                return common.response(res, code.EVERY_THING_IS_OK, message.OTP_SENT, { otp });
            }, err=>{
                return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR)
            })

        }
    }, err=>{
        return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, err)
    })
}

const getAdmin = (req, res, next)=>{
    verifyToken(req, res, 'getAdmin')
}

module.exports = {
    login,
    getAdmin,
    forgotPassword
}