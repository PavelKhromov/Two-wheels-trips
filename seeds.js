var mongoose = require("mongoose");
var Trip = require("./models/trip");
var Comment   = require("./models/comment");


var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "reprehendaecat crum"
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Trip.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("removed trips!");
        //add a few trips
        data.forEach(function(seed){
                Trip.create(seed, function(err, trip){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added trip");
                        //create a comment
                        Comment.create(
                            {
                                text: "This trip is great!!!",
                                author: "Ghost Rider"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    trip.comments.push(comment);
                                    trip.save();
                                    console.log("Created new comment")
                                }
                               
                            });
                    }
                });
        
        }); 
    });
        

    //add a few comments
   }


 
module.exports = seedDB;