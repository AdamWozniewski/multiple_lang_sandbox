import mongoose, {Schema} from "mongoose";
import {validateEmail} from "../validators.js";
import {generate} from "randomstring";
import { hashPassword, verifyPassword } from '../../../services/hash.js';

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Pole email jest wymagane'],
        validate: [validateEmail, 'Niepoprawny adres email'],
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'hasło powinno posiadać przynajmniej 4 znaki'],
    },
    firstName: String,
    lastName: String,
    apiToken: String,
});

userSchema.pre("save", function (next) {
    const user = this
    user.password = hashPassword(user.password);
    next();
});

userSchema.post('save', (err, doc, next) => {
   if (err.code === 11000) {
       err.errors = {
           email: {
               message: 'Taki email już istnieje'
           }
       }
   }
    next(err);
});

userSchema.post('save', function (err, doc, next) {
    const user = this;
    if(user.isNew) {
        user.apiToken = generate(30);
    }
    next();
});

userSchema.methods = {
    comparePassword: function (password) {
        return verifyPassword(password, this.password);
    }
};

userSchema.virtual('fullName').get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`;
});
export const User = mongoose.model('User', userSchema);
