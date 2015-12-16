// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
// TODO: create a script that assigns the counting game score to the correct game and remove the default option
// TODO: perhaps create another model for games (e.g. have ID for games insteas of string names
// TODO: in back-end code make sure either name or playerId is specified
module.exports = mongoose.model('AllStar', {
    game : { type: String, required: true, default: 'count' },
    score : { type : Number, required: true },
    time : { type : Number, required: true },
    name : { type : String, required: true, default: "Anonymous" },
    playerId : { type: String }
});