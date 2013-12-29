/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');


/**
 * Game Schema
 */
var GameSchema = new Schema({
    myScore: Number,
    opponent: { 
        user: String,
        score: Number
    },
    created : {
        type : Date,
        default : Date.now
    },
    details : {
        typeOfGame: String,
        official: Boolean,
        points: Number,
        victory: Boolean
    },
    date: {
        type : Date,
        default : Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

GameSchema.path('myScore').validate(function(myScore) {
    return myScore.length;
}, 'myScore cannot be blank');

GameSchema.path('opponent.user').validate(function(opponentUser) {
    return opponentUser.length;
}, 'opponentUser opponentUser be blank');

GameSchema.path('opponent.score').validate(function(opponentScore) {
    return opponentScore.length;
}, 'opponent.score cannot be blank');

GameSchema.path('details.typeOfGame').validate(function(typeOfGame) {
    return typeOfGame.length;
}, 'typeOfGame cannot be blank');

GameSchema.path('date').validate(function(date) {
    return date.length;
}, 'date cannot be blank');

/**
 * Statics
 */
GameSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'firstName lastName email').exec(cb);
    },
    findByName: function (name, cb) {
        this.find({ 
            name: new RegExp(name, 'i') }, cb);
    }
};

mongoose.model('Game', GameSchema);