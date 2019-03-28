import { Mongoose } from "mongoose";

// if deployed, use the deployed database. Otherwise, use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhose/mongoHeadlines";

Mongoose.connect(MONGODB_URI);