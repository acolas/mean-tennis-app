/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Game = mongoose.model('Game'),
    User = mongoose.model('User'),
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
    //need this to get object opponent user
    User.findOne({ _id: req.body.opponent._id }).exec(function(err, user) {
        var game = new Game(req.body);
        console.log(game);
        game.user = req.user;

        if (err) {
            console.log(err);
        } else {
            game.opponent.user = user;
            game.save(function(err) {
                if (err) {
                    return res.send('users/signup', {
                        errors: err.errors,
                        game: game
                    });
                } else {
                    res.jsonp(game);
                }

            });
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
    Game.find().sort({date: 'asc'}).populate('user opponent.user', 'firstName email').exec(function(err, games) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(games);
        }
    });
};
