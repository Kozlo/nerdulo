// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('AllStar', {
    name : { type : String },
    score : { type : Number },
    time : { type : Number }
});