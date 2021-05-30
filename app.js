//Requiring node modules
const express= require("express");
const bodyparser= require("body-parser");

// Code to run the modules
const app= express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

//Global Variables
var toDo= ["Learn Node", "Learn React", "Read Moby Dick"];
let workToDo=[];
//Get Requests
app.get("/", function(req,res){
    var today= new Date();
    const options={
        weekday : "long",
        day: "numeric" ,
        month: "long",
        year: "numeric"
    };

    var day=today.toLocaleDateString("en-US",options);
    
    res.render("index", {listType: day, toDo : toDo});

});

app.get("/work", function(req,res){      
    res.render("index", {listType: "Work", toDo : workToDo});
})

//Post Requests
app.post("/", function(req,res){
    console.log(req.body);
    const todoItem= req.body.item;
    if(req.body.list== "Work"){
        workToDo.push(todoItem);
        res.redirect("/work");
    }else{
        toDo.push(todoItem);
        res.redirect("/");
    }
    
});

//Listen Request
app.listen("3000",function(){
    console.log("Server Started at port 3000");
})