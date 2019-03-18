var Admin = require('../models/admin');
const common = require('../common/commonFunction');
const message = require('../common/message');
const code = require('../common/code');

const getAdmin = (req, res)=>{
    let { _id } = req.admin;
    Admin.findById(_id, { password:0 })
    .then(admin=>{
        return common.response(res, code.EVERY_THING_IS_OK, message.SUCCESS, admin);
    }, err=>{
        return common.response(res, code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR)
    })
}

module.exports = {
    
    getAdmin
}