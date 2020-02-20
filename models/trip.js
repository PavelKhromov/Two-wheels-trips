var mongoose = require("mongoose");
 
var tripSchema = new mongoose.Schema({
   name: String,
   distance: String,
   image: String,
   imageId: String,
   description: String,
   createdAt: {type: Date, default: Date.now},
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
  },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Trip", tripSchema);