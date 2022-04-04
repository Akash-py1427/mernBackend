const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/User-Database",
{useNewUrlParser:true,
useUnifiedtopology:true}).then(()=>{
console.log(`Database connsection Successful`);    
}).catch((e)=>{
    console.log(`Error : ${e}`);
})