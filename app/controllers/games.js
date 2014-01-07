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

    console.log(req.body.opponent.user);
    req.body.opponent.user = new User({_id : req.body.opponent.user._id, email: req.body.opponent.user.email });
    console.log(req.body.opponent.user);
    var game = new Game(req.body);
    game.user = req.user;

    //console.log(req.body.opponent.user._id);
    //{ message: 'Cast to ObjectId failed for value "[object Object]" at path "opponent.user"',
    game.opponent.user = req.body.opponent.user;
    console.log(game.opponent.user);
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
 */
exports.all = function(req, res) {
    Game.find().sort({date: 'asc'}).populate('user', 'name email').exec(function(err, games) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(games);
        }
    });
};
