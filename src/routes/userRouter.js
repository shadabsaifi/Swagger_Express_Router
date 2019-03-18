const User = require('../models/user');
const common = require('../common/commonFunction');
const message = require('../common/message');
const code = require('../common/code');
const userController = require('../controller/userController');

const verifyToken = (req, res, ApiName)=>{
    let { accesstoken } = req.headers;
    console.log("accesstoken====>>>",accesstoken)
    common.verifyToken(accesstoken)
    .then(decode=>{
    let { _id, email } = decode;
        User.findById(_id).lean()
        .then(user=>{
            req['user'] = user;
            userController[ApiName](req, res);
        }, err=>{
            return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR)
        })
    }, err=>{
        return common.response(res, code.UNAUTHORIZED, message.INVALID_TOKEN)
    })
}

const createUser = (req, res)=>{
    User.create(req.body)
    .then(result=>{
        let { _id, email, firstName, lastName } = result;
        let data = { _id, email }
        common.createToken(data)
        .then(token=>{
            let finalData = { _id, email, firstName, lastName, token };
            return common.response(res, code.EVERY_THING_IS_OK, message.USER_CREATED, finalData);
        }, err=>{
            return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, err)
        })
    }, err=>{
        return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, err)
    })

}

const getAllUser = (req, res)=>{
    verifyToken(req ,res, 'getAllUser');
}

const updateUser = (req, res)=>{
    verifyToken(req ,res, 'updateUser');
}

const deleteUser = (req, res)=>{
    verifyToken(req ,res, 'deleteUser');
}

const uploadFile = (req, res, next)=>{
    verifyToken(req, res, 'uploadFile');
}

module.exports = {
    
    createUser,
    getAllUser,
    updateUser,
    deleteUser,
    uploadFile
}