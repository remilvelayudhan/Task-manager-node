const mongoose =require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password:{type: String, required: true},

},{
    timestamps: true
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    try {
        const hash = await bcrypt.hash(this.password, 8);
        this.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
});

module.exports = mongoose.model('User',userSchema);
