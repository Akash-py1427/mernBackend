
 require("dotenv").config()
const { hasSubscribers } = require("diagnostics_channel")
const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const port = process.env.PORT || 3000

require("./db/connection")
const user_collection=require('./models/userSchema')
const { urlencoded } = require("express")
const statitc_path = path.join(__dirname,"../public")
const template_path = path.join(__dirname,"../template/views")
const partial_path = path.join(__dirname,"../template/partials")
// console.log(path.join(__dirname,"../template/partials"));
console.log(process.env.SECRET_KEY)
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partial_path)
app.use(express.static(template_path))
// console.log(path.join(__dirname,"../templates/views/index"))
app.use(express.json())
app.use(express.urlencoded({extended:false}));


app.get("/home",(req,res)=>{
    res.render("index")
})

app.get("/register",(req,res)=>{
    res.render('register')
})

//create a new user in our database 
app.post('/register',async(req,res)=>{
    try{
        const regPassword  = req.body.password
        const regConfirmPassword = req.body.ConfirmPassword
        if(regPassword==regConfirmPassword){
            const saveUserData = new user_collection({
                FirstName : req.body.first_name,
                LastName : req.body.last_name,
                email    : req.body.email,
                phone   :  req.body.phone,
                password : regPassword,
                ConfirmPassword : regConfirmPassword
            })

        // this will work as a middleware in which the token will generate in
        //user_Schema file that token we're importing here via calling generateAuthToken function
        console.log("success part " + saveUserData );   
        const generatedToken = await saveUserData.generateAuthToken()
            console.log("the token part "+ generatedToken);
            
            const RegData = await saveUserData.save()
            console.log("the page part " + RegData );
            res.status(201).render('index')
        }else{
            res.send('password not match')
        }
    }catch(error){
        res.status(400).send(error)
    }






})
app.get("/login",(req,res)=>{
  
    res.render('login')
})

app.post("/login",async(req,res)=>{
    try {
        const logPassword = req.body.logPassword
    const logEmail = req.body.email
    // console.log(logEmail)
    const logData = await user_collection.findOne({email:logEmail})


    const isMatch = await bcrypt.compare(logPassword,logData.password)

    const generatedToken = await logData.generateAuthToken()
    console.log("the token part "+ generatedToken);
   
    console.log(":the success part " + logData)

    if(isMatch){
        res.status(201).render('index')
    }else{
        res.send('Invalid Login Credentials')
    }
    
    }catch (error) {
        res.status(400).send(error)
        
    }
    
})

app.listen(port,()=>{
    console.log(`server running at port ${port}..`)
})