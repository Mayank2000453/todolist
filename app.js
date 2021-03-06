const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const app=express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

const itemsSchema = {
  name: String
};

//  Model
// Our model "Item" will follow the itesmSchema
const Item = mongoose.model("Item",itemsSchema);

//  Creating default documents
const item1 = new Item({
  name: "Welcome todolist"
});

const item2 = new Item({
  name: "Hit the  button to add a new Item."
});

const item3 = new Item({
  name: "<--- Hit this to delete an item."
});

const defaultItems = [item1,item2,item3];

const listSchema = {
  name: String,
  items : [itemsSchema]
};


const List = mongoose.model("List", listSchema);





// --------------------Home Route----------------------------------------//
app.get("/",function(req,res){



  Item.find({}, function(err,foundItems)
{
  if(foundItems.length === 0){

    Item.insertMany(defaultItems, function(err)
    {
      if(err)
      {
        console.log(err);
      }
      else{
        console.log("Successfully saved default items");
      }
    });
    res.redirect("/");
  }
  else {
    res.render("list",({listTitle:"Today",newListItems: foundItems}));
  }

});


});


// ----Custom--------//

app.get("/:customListName",function(req,res)
{
  const customListName = (req.params.customListName);

List.findOne({name: customListName}, function(err,foundList)
{
  if(!err)
  {
    if(!foundList){
    // Create a new list  console.log("Doesn't exist");
    const list = new List ({
      name: customListName,
      items: defaultItems
    });
    list.save();
    res.redirect("/"+ customListName);
    }
    else{
      res.render("list",{listTitle:foundList.name,newListItems: foundList.items})
    }
  }
});

});


// ----- A new document created with new Item in it-----------------//

app.post("/",function(req,res){
 const itemName =req.body.newItem;
 const listName = req.body.list;

 const item = new Item({
 name: itemName
});

 if(listName=== "Today")
 {
   item.save();
   res.redirect("/");
 }
 else{
   List.findOne({name: listName}, function(err, foundList)
 {
 foundList.items.push(item);
 foundList.save();
 res.redirect("/"+ listName);
 })
 }


});

//---------------Item Delete--------------------------------------------//

app.post("/delete",function(req,res)
{
  const checkedItem = req.body.checkbox;
  Item.findByIdAndRemove(checkedItem, function(err)
{
  if(!err)
  {
    console.log("Successfully deleted");
    res.redirect("/");
  }
})
});

// ----------------------- Work Route------------------------------------//


app.post("/work",function(req,res)
{
  let item=req.body.newItem;
workItems.push(item);
res.redirect("/work");
})


// -----------------Listen---------------------------------------------//
app.listen(3000,function()
{
  console.log("Server staretd on port 3000");
})
