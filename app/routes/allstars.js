var Allstar = require('../models/allstar');

module.exports = function(app) {
    // GET =============
    app.get('/api/allstars', function (req, res) {
        Allstar.find(function (err, allstars) {
            if (err)
                res.send(err);
            console.log('Found ' + allstars.length + ' allstars.');
            res.json(allstars);
        });
    });

    // CREATE =============
    app.post('/api/allstars', function (req, res) {
        var name = req.body.name,
            score = req.body.score,
            time = req.body.time;

        if (typeof name == 'undefined' || typeof score == 'undefined' || typeof time == 'undefined') {
            console.log('Not all mandatory fields have been entered.');
            res.send({valid: 0, error: "Not all mandatory fields have been entered." });
            return;
        }

        Allstar.create({
            name: name,
            score: score,
            time: time
        }, function (err, allstar) {
            if (err)
                res.send(err);
            console.log('allstar saved successfully: ', allstar);
            Allstar.find(function (err, allstars) {
                if (err)
                    res.send(err);
                console.log('Found ' + allstars.length + ' allstars after saving the new one.')
                res.json(allstars);
            });
        });
    });

    // DELETE =============

    app.delete('/api/allstars/:allstar_id', function (req, res) {
        Allstar.remove({
            _id: req.params.allstar_id
        }, function (err) {
            if (err)
                res.send(err);
            console.log('allstar deleted successfully');
            // get and return all todos after you delete one
            Allstar.find(function (err, allstars) {
                if (err)
                    res.send(err);
                console.log('returning ' + allstars.length + 'allstars');
                res.json(allstars);
            });
        });
    });
};