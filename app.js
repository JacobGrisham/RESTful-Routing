// Application configuration. Calling npm packages
const express 			= require("express"),
	  app 				= express(),
	  methodOverride 	= require("method-override"),
	  mongoose 			= require("mongoose"),
	  bodyParser 		= require("body-parser");


// Create the MongoDB "blog"
mongoose.connect("mongodb://localhost/blog", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
// Mongoose's findOneAndUpdate() long pre-dates the MongoDB driver's findOneAndUpdate() function, so it uses the MongoDB driver's findAndModify() function instead. Use this to use findOneAndUpdate()
mongoose.set('useFindAndModify', false);
// Use this so we don't have to specify ".ejs" at the end of every ejs file
app.set("view engine", "ejs");
// Enable bodyParser
app.use(bodyParser.urlencoded({extended: true}));
// So we can use our custom style sheet
app.use(express.static("public"));
// Enable method-override. The argument "_method" can be anything, but it convention to use "_method"
app.use(methodOverride("_method"));

// Mongoose model configuration
var blogSchema = new mongoose.Schema({
	title: String,
	image: {type: String, default: "https://content.mycutegraphics.com/graphics/career/blank-photograph.png"},
	body: String,
	created: {type: Date, default: Date.now}
});

// Connecting variable "Blog" to the MongoDB
var Blog = mongoose.model("Blog", blogSchema);

// Create a blog just to get started. Itentionally left image and body blank
// Blog.create({
// 	title: "Test Blog",
// 	body: "This is to ensure that everything is working properly",
// });

// RESTful Routes
// Redirects to INDEX Route
app.get("/", function(req, res){
	res.redirect("/blogs");
})

// INDEX Route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs:blogs}); // blogs:blogs = variable name defined in the function: the data 
		}
	});
});

// NEW Route
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE Route
app.post("/blogs", function(req, res){
	// Create blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else{
			// Redirect to index
			res.redirect("/blogs");
		}
	})
});

// SHOW Route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(foundBlog){
			// "blog" is what we will refer to in our HTML
			// "foundBlog" is what we use to link up the data to "blog?
			res.render("show", {blog:foundBlog});
		}
	);
});

// EDIT Route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			// "blog" is what we will refer to in our HTML
			// "foundBlog" is what we use to link up the data to "blog?
			res.render("edit", {blog:foundBlog});
		}
	});
});
// UPDATE Route
app.put("/blog/:id", function(req, res){
	Blog.findByIDAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			// Can also use ("/blogs/" + updatesblog._id);
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DELETE Route
app.delete("/blog/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			// Even though we redirect to the same path, it's important to check for errors
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	});
});

// Connect app.js file to Server
app.listen(3000, function(){
	console.log("Punch it R2!!!")
});