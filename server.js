// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
// Models
var Note = require("./models/Note");
var Article = require("./models/Article");

var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(process.cwd() + "/public"));

// if deployed, use the deployed database. Otherwise, use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {useNewUrlParser: true}, (err) => {
    if (err) {
        console.log(err);
    }else{
        console.log("connected to DB");
    }
});

//var db = mongoose.connection;

// db.on("error", (error) => {
//     console.log(`Mongoose Error: `, error);
// });

// db.once("open", () => {
//     console.log(`Mongoose connection successful.`);
// });

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// var router = express.Router();

require("./config/routes")(app);

// app.use(router);

var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`app running on port ${port}`);
});