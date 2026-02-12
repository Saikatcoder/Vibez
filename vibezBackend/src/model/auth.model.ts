import { model, Schema } from "mongoose";

const authSchema =new Schema ({
    fullname:{
        type:String,
        require: true,
        lowercase: true,
        trim : true
    },
    email: {
        type: String,
        require: true,
        trim : true
    },
    mobile: {
        type: String,
        require: true,
        trim : true
    },
    password: {
        type: String,
        require: true,
        trim : true
    }
}, {timestamps:true})

const AuthModel = model('Auth',authSchema)
export default AuthModel