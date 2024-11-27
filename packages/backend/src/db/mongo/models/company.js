import {validateForbiddenString} from "../validators.js";
import mongoose, {Schema} from "mongoose";

const companySchema = new Schema({
    slug: {
        type: String,
        required: [true, 'pole slug jest wymagane'],
        minlength: 3,
        maxlength: [6, 'maksymalna liczba znaków to 6'],
        validate: (value) => validateForbiddenString(value, 'slug')
    },
    name: {
        type: String,
        required: true,
    },
    employeesCount: {
        type: Number,
        min: 1
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    image: String,
})
export const Company  = mongoose.model('Company', companySchema);
