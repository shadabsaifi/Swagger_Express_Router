var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var common = require('../common/commonFunction');
var adminSchema = new Schema({
    email: {
        type: String,
        trim: true
    },
    firstName: {type: String},
    lastName: {type: String},
    hash:{ type:String },
    otp:{ type:Number }
})

adminSchema.plugin(mongoosePaginate);
var adminModel = mongoose.model('admin', adminSchema, 'admin');

adminModel.findOne()
.then(admin=>{
    if(!admin){
        common.createHash("123456")
        .then(hash=>{
            adminModel.create({
                email:"admin@admin.com",
                firstName:"Shadab",
                lastName:"Saifi",
                hash
            })
            .then(result=>{
                console.log("Admin Created Successfully.");        
            }, err=>{
                console.log("error while create admin")
            })
        }, err=>{
            console.log("error while create hash of admin")
        })
    }
}, err=>{
    console.log("error while find admin")
})

module.exports = adminModel;