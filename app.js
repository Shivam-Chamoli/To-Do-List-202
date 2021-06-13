//Requiring node modules
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

// Code to run the modules
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({
    extended: true
}));
mongoose.connect('mongodb://localhost:27017/toDoItems', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//setting up db
const itemSchema = mongoose.Schema({
    name: String
});
const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const Item = new mongoose.model("Item", itemSchema);
const List = new mongoose.model("List", listSchema);


//Global Variables
const item1 = new Item({
    name: "Get Up Early"
});
const item2 = new Item({
    name: "Do Meditation"
});
const item3 = new Item({
    name: "Revise Yesterdays Work"
});
let defaultToDo = [item1, item2, item3];

//Getting Date
var today = new Date();
const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
};
var day = today.toLocaleDateString("en-US", options);

//Get Requests
app.get("/", function (req, res) {
    
    Item.find(function (err, it) {
        if (err) {
            console.log(err);
        } else {
            if (it.length === 0) {

                Item.insertMany(defaultToDo, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Items Inserted Successfully")
                    }
                })
                res.redirect("/")
            } else {
                //rendering page
                res.render("index", {
                    listType: day,
                    toDo: it
                });
            }
        }

    });
});

app.get("/:param", function (req, res) {
    const route = req.params.param;
    const routeName=route.charAt(0).toUpperCase() + route.slice(1);
    List.findOne({
        name: route
    }, function (err, it) {
        if (err) console.log(err);
        else {
            if (!it) {
                const newList = new List({
                    name: route,
                    items: defaultToDo
                });
                newList.save();
                res.redirect("/" + route);

            } else {

                console.log(it);
                res.render("index", {
                    listType: routeName,
                    toDo: it.items
                });
            }
        }
    })

});



//Post Requests
app.post("/", function (req, res) {
    console.log(req.body);
    const newItem = new Item({
        name: req.body.item
    });
    let listType= req.body.list;
    listType=listType.toLowerCase();
    console.log(listType);
    if(listType==String(day)){
        newItem.save();
        res.redirect("/");
    }else{       
        List.findOne({name:listType},function(err,it){
            if(err) console.log(err);
            else{
                it.items.push(newItem);
                it.save();
                console.log(it.items);
                res.redirect("/"+listType);
            }
        })
    }

});

app.post("/delete", function (req, res) {
    console.log(req.body);
    const deleteItem = req.body.checked;
    Item.findByIdAndRemove(deleteItem, {
        useFindAndModify: true
    }, function (err) {
        if (err) console.log(err);
    })
    res.redirect("/");
})

//Listen Request
app.listen("3000", function () {
    console.log("Server Started at port 3000");
})