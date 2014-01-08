/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Game = mongoose.model('Game'),
    _ = require('underscore');


/**
 * Find game by id
 */
exports.game = function(req, res, next, id) {
    Game.load(id, function(err, game) {
        if (err) return next(err);
        if (!game) return next(new Error('Failed to load game ' + id));
        req.game = game;
        next();
    });
};

/**
 * Find games by user id
 */
exports.findByName = function(req, res) {
    Game.find({ user: req.user._id }).exec(function(err, games) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(games);
        }
    });
};


/**
 * Create a game
 */
exports.create = function(req, res) {
    req.body.opponent.user =  req.body.opponent.user._id;
    var game = new Game(req.body);
    game.user = req.user;
    //{ message: 'Cast to ObjectId failed for value "[object Object]" at path "opponent.user"',
    //game.opponent.user = req.body.opponent.user._id;
    game.save(function(err) {
        if (err) {
            console.log(err);
            return res.send('users/signup', {
                errors: err.errors,
                game: game
            });
        } else {
            res.jsonp(game);
        }
    });
};

/**
 * Update a game
 */
exports.update = function(req, res) {
    var game = req.game;

    game = _.extend(game, req.body);

    game.save(function(err) {
        res.jsonp(game);
    });
};

/**
 * Delete a game
 */
exports.destroy = function(req, res) {
    var game = req.game;

    game.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(game);
        }
    });
};

/**
 * Show a game
 */
exports.show = function(req, res) {
    res.jsonp(req.game);
};

/**
 * List of Games

exports.all = function(req, res) {
    console.log("exports.all");
    Game.find({ user: req.user._id }).sort({date: 'asc'}).limit(5).populate('user', 'firstName email').exec(function(err, games) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(games);
        }
    });
};
*/
/**
 * List of Games
 */
exports.all = function(req, res) {
    console.log("exports.history");
    Game.find().sort({date: 'asc'}).populate('user', 'firstName email').exec(function(err, games) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(games);
        }
    });
};
