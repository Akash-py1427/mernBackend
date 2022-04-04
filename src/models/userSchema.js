const mongoose = require("mongoose")
const { stringify } = require("nodemon/lib/utils")
const validator = require("validator")
const bcrypt  = require('bcrypt')
const async = require("hbs/lib/async")
const jwt = require("jsonwebtoken")

const UserSchema = mongoose.Schema({
    FirstName:{
        type:String,
        required:true,
    },
    LastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    phone:{
        type:Number,
        minLength:10,
        maxLength:10,
        unique:true
    },

    password:{
        type:String,
        required:true,
        minLength:3,
       
    },
    ConfirmPassword:{
        type:String,
        required:true
    },
    Tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})
//generating Token
UserSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const generate_token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY) 
        this.Tokens = this.Tokens.concat({token:generate_token})
        // console.log(generate_token);
        //storing the token in the database 
        await this.save()
        return generate_token
    } catch (error) {
        console.log(`the error part ${error}`);
        
    }
}







//bcrypt middleware will hash the password before string into database
//the pre method will call after geeting data fro body and before saving it to database
UserSchema.pre("save",async function(next){
    if(this.isModified("password")){
    //     const hashedPassword = bcrypt.hash( password ,10)
        console.log(this.password);
        this.password = await bcrypt.hash(this.password,10)
        console.log('hashed password is ' , this.password);
        this.ConfirmPassword = await bcrypt.hash(this.password,10)
}
next()
}) 

const user_collection = new mongoose.model("user_collection",UserSchema)

module.exports= user_collection;