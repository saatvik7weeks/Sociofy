const express= require('express')
let app= express();
const path= require('path');
const usermodel = require('./models/user');
const postmodel = require('./models/post');
const cookieparser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer= require('./config/multer');


app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.use (express.static(path.join(__dirname,'public')))
app.use(express.json());
app.use(cookieparser())


app.get('/',(req,res)=>{
    res.render('index.ejs');
});
app.post('/register',async(req,res)=>{
 let user = await usermodel.findOne({ email: req.body.email });
if (user)
{
    return res.status(500).send("User already exists")
}
   bcrypt.genSalt(10,(err, salt)=>{
bcrypt.hash(req.body.password ,salt, async(err ,hash)=>{
    let createuser = await usermodel.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        age:req.body.age,
        password: hash
});
let token =jwt.sign({email:req.body.email,userid: createuser._id },"shhhhhhh")
    res.cookie('token',token)
     res.redirect('/login')
    });
 });
});

app.get('/login',(req,res)=>{
    res.render('login.ejs');
});

app.post('/login',async (req,res)=>{
   let user = await usermodel.findOne ({email:req.body.email})
   if (!user)
   {
    return res.status(401).send("invalid user")
   }
  bcrypt.compare(req.body.password ,user.password ,(err,result)=>{
   
    if(result)
    {
        let token=jwt.sign({email:req.body.email},"shhhhhhh")
        res.cookie('token',token)
        res.redirect('/profile')

    }
    else
    {
        return res.status(401).send("invalid password")
    }
  })

});

app.get('/profile', isloggedin , async(req,res)=>{
    let user=await usermodel.findOne({email:req.user.email}).populate('posts')
    
    res.render('profile.ejs',{user:user}); 
});


app.get('/profile/upload', isloggedin , async(req,res)=>{    
    res.render('profilepic.ejs'); 
});


app.post('/upload', isloggedin , multer.single('image'), async(req,res)=>{    
   let user = await usermodel.findOne({email:req.user.email})
    user.profilepic = req.file.filename;
    await user.save()
    res.redirect('/profile')
});

app.post('/post', isloggedin , async(req,res)=>{
    let user=await usermodel.findOne({email:req.user.email})
    let post = await postmodel.create({       
        user: user._id,
        content:req.body.content
    })
  user.posts.push(post._id)
  await user.save()
  res.redirect('/profile')
});


app.get('/logout',(req,res)=>{
    res.cookie("token","")
    res.redirect('/login')
})

function isloggedin(req,res,next){
    if(req.cookies.token === "")
    {
        res.redirect('/login')
    }
   else {
    let data =jwt.verify(req.cookies.token,"shhhhhhh")
    req.user=data
    next()
   }

}



app.listen(3000, () => {
    console.log("Server is running on port 3000");
})


