/**
 * MongoDB Model for Users Collection
 * Created by Alexey S. Kiselev on April 2017.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt-nodejs');

var usersSchema = new mongoose.Schema({
    userid: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userprofile: {
        type: String
    }
}, { collection: 'users' });

usersSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
usersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Users',usersSchema);