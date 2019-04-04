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
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

module.exports = mongoose.model("Article", ArticleSchema);