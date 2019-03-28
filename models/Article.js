var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String
    },
    link: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("Article", ArticleSchema);