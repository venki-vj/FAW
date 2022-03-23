const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const ejsMate=require('ejs-mate');
const bcrypt = require("bcryptjs");
const session = require("client-sessions");
const catchAsync =require('./utils/catchAsync');
const app = express();


mongoose.connect('mongodb+srv://dbUser:dbUser@joblist.qq5pq.mongodb.net/JobApp?retryWrites=true&w=majority',(error,db)=>{
    if(error) throw error;


});
const db=mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once('open',() =>
    console.log('Database connected'))


app.use(session({
    cookieName : "JobUser",
    
    secret : "cty7u8iol,mnbvfrt6y7890-[;lkmnbgvfrty7u8i9op;l,mnbvcfrty7uiol,mnbvgtyuiop[oiuygtfvmku",
    duration : 30 * 60 * 1000,
    activeDuration : 10 * 60 * 1000
}));


const JobSchema=mongoose.Schema({
    job_description_html:String,
    job_title:String,
    company_name:String,
    location:String,
    job_url:String,
    url:String
})

const Joblist= mongoose.model('Joblist',JobSchema);

// let Schema =mongoose.Schema;
// let ObjectId =Schema.ObjectId;
// let List=mongoose.model('List',new Schema({
//     id:ObjectId,
//     job_title:String,
//     job_description:String,
//     company_name:String,
//     location:String,
//     url:String,
//     timeStamp: { type: Date, default: Date.now }
// }));
// let User=mongoose.model('User',new Schema({
//     id:ObjectId,
//     email : { type : String, required : true, unique : true },
//     password:String,
//     firstname:String,
//     lastname:String
// }))
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));


app.use((req,res,next)=>{
//   res.local.currentUser=req.user;
    
  next();
})



app.get('/',catchAsync(async(req,res,next)=>{
    const list = await Joblist.find({});
 
    if(req.params.id ==='favicon.ico'){
        next()
    }
    res.render('index',{list})
}))


app.get('/:id',catchAsync(async (req,res)=>{
    
    const jobs= await Joblist.findById(req.params.id);
  
    res.render('show',{jobs})
}))

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/register',(req,res)=>{
    let hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    console.log(req.body.password, hash);
    let user = new User({
     firstname : req.body.firstname,
     lastname : req.body.lastname,
     email : req.body.email,
     password : hash
    });
    user.save(function(error){
        if(error){
            if( error.code === 11000 ){
             console.log("eMail id exists ", error)
         }else{
             console.log("Error ", error)
            }
        }
        else{
            res.redirect("/");
        }
    })
})

app.get('/add',(req,res)=>{

    res.render('jobPost')
})




port=1234;
app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})