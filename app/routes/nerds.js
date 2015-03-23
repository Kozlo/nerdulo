var Nerd = require('../models/nerd');

module.exports = function(app) {
    // GET =============
    app.get('/api/nerds', function(req, res) {
        // use mongoose to get all nerds in the database
        Nerd.find(function(err, nerds) {
            // if there is an error retrieving, send the error.
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);
            console.log('Found ' + nerds.length + ' nerds.');
            res.json(nerds); // return all nerds in JSON format
        });
    });

    // CREATE =============
    app.post('/api/nerds', function(req, res) {
        // use mongoose to get all nerds in the database
        var name = req.body.name,
            tool = req.body.tool;

        // TODO: add validation here

        Nerd.create({
            name: name,
            tool: tool
        }, function(err, nerd) {
            if (err)
                res.send(err);
            // get and send all new nerds after you created the new one
            console.log('nerd saved successfully: ', nerd);
            Nerd.find(function(err, nerds) {
                if (err)
                    res.send(err);
                console.log('Found ' + nerds.length + ' nerds after saving the new one.')
                res.json(nerds); // return all nerds in JSON format
            });
        });
    });

    // DELETE =============
    app.delete('/api/nerds/:nerd_id', function(req, res) {
        Nerd.remove({
            _id : req.params.nerd_id
        }, function (err) {
            if (err)
                res.send(err);
            console.log('nerd deleted successfully');
            // get and return all todos after you delete one
            Nerd.find(function(err, nerds) {
                if (err)
                    res.send(err);
                console.log('returning ' + nerds.length + 'nerds');
                res.json(nerds);
            });
        });
    });
};