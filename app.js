const express=require("express");
const bodyParser=require("body-parser");
const mongoose= require("mongoose");
const ejs=require("ejs");

const app=express();

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const articleSchema= mongoose.Schema({
  title: String,
  content: String
});
const Article= mongoose.model("Article",articleSchema);
/////////////////////requests targeting all articles/////////////
app.route("/articles")
.get(function(req,res){
  Article.find(function(err,articles){
    if(!err){
      res.send(articles);
    }
    else{
      res.send(err);
    }
  });

})

.post(function(req,res){

  const newArticle= new Article({
    title: req.body.title,
    content:req.body.content
  });
newArticle.save(function(err){
 if(err){
   res.send("Success!");
 } else {
   res.send(err);
 }
});

})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfuly deleted all articles");
    } else {
      res.send(err);
    }
  });
});
/////////////////requests targeting single articles/////////
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("Sorry we couldn't find article with that name.");
    }
  });
})
.put(function(req,res){
  Article.replaceOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    function(err){
      if(!err){
        res.send("succesfuly updated the document!");
      }else{
        res.send(err);
      }
    }
  );
})
.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Succesfuly patched data!");
      } else {
        res.send(err);
      }
    }
  );
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("Successfuly deleted the article");
    } else {
      res.send(err);
    }
  });
});

 app.listen(3000,function(){
   console.log("server is running on port 3000");
 })
