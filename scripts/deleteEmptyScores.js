var Allstar = require('../app/models/allstar'),
    mongoose = require('mongoose'),
    db = require('../config/db');

// connect to our mongoDB database
mongoose.connect(db.url);

Allstar.remove({
    name : null
}, function (err) {
    if (err)
        res.send(err);
    console.log('allstar deleted successfully');
    // get and return all todos after you delete one
    Allstar.find(function(err, allstars) {
        if (err)
            res.send(err);
        console.log('returning ' + allstars.length + 'allstars');
    });
});