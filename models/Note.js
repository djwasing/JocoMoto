var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 250
    }
});

module.exports = mongoose.model("Note", NoteSchema);