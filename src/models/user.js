var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var userSchema = new Schema({
    email: {
        type: String,
        trim: true
    },
    firstName: {type: String},
    lastName: {type: String},
    profilePic:{ type:String }
})

userSchema.plugin(mongoosePaginate);
var userModel = mongoose.model('user', userSchema, 'user');
module.exports = userModel;