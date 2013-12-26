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
 * Create a game
 */
exports.create = function(req, res) {
    var game = new Game(req.body);
    
    article.save(function(err) {
        if (err) {
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
    var game = req.gaùe;

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
    Game.find().sort('-created').populate('user', 'name email').exec(function(err, games) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(games);
        }
    });
};
