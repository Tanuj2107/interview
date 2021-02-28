const express = require("express");
const path = require("path");
const app = express(); 
const Register = require("./models/user");
app.set("view engine", "ejs"); 

const connectDB = require("./db/connect");
console.log(connectDB)
connectDB();

const static_path = path.join(__dirname, "/views");


app.use(express.static(static_path))
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// home page 
app.get("/", function (req, res) { 
    res.render("index"); 
}); 

// register page 
app.get("/register", function (req, res) { 
    res.render("register"); 
}); 

app.post("/register", async (req, res) => { 
    try{

        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password === confirmpassword){

            const newUser = new Register({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                confirmpassword : req.body.confirmpassword
            })

            const registered = await newUser.save();
            res.status(201).render("index");

        }else{
            res.send("Password are not matching")
        }

    } catch (error){
        res.status(400).send(error);
    }
}); 
  
//login form 
app.get("/login", function (req, res) { 
    res.render("login"); 
}); 


app.post("/login", async (req, res) => { 
    try{

        const email = req.body.email;
        const password = req.body.password;
        
        const useremail = await Register.findOne({email:email});
        
        if(useremail.password === password){
            res.status(201).render("index");
        }else{
            res.send("Invalid");
        }

    } catch (error){
        res.status(400).send("Invalid email");
    }
}); 
  
const port = process.env.PORT || 3000; 
app.listen(port, function () { 
    console.log("Server Has Started!"); 
}); 