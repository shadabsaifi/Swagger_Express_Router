const User = require('../models/user');
const common = require('../common/commonFunction');
const message = require('../common/message');
const code = require('../common/code');
var multiparty = require('multiparty');


const getAllUser = (req, res)=>{
    let { page, limit } = req.query;
    let options =  { page:Number(page) || 1, limit:Number(limit) || 10 };
    User.paginate({}, options)
    .then(result=>{
        return common.response(res, code.EVERY_THING_IS_OK, message.SUCCESS, result);
    }, err=>{
        return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR)
    })  
}

const updateUser = (req, res)=>{
    let { _id } = req.body;
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        console.log("fiels===>>>",files);
        console.log("fields===>>>",fields);
    });
    User.findByIdAndUpdate(_id, req.body, { new:true })
    .then(result=>{
        return common.response(res, code.EVERY_THING_IS_OK, message.USER_UPDATED, result);
    }, err=>{
        return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, err)
    })

}

const deleteUser = (req, res)=>{
    let { _id } = req.body;
    User.remove({_id})
    .then(result=>{
        return common.response(res, code.EVERY_THING_IS_OK, message.USER_UPDATED, result);
    }, err=>{
        return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, err)
    })
}

module.exports = {
    
    getAllUser,
    updateUser,
    deleteUser
}