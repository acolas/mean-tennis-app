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
    opponentUser: String,
    opponentScore: Number,
    created : {
        type : Date,
        default : Date.now
    },
    typeOfGame: String,
    official: Boolean,
    points: Number,
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

GameSchema.path('opponentUser').validate(function(opponentUser) {
    return opponentUser.length;
}, 'opponentUser opponentUser be blank');

GameSchema.path('opponentScore').validate(function(opponentScore) {
    return opponentScore.length;
}, 'opponentScore cannot be blank');

GameSchema.path('typeOfGame').validate(function(typeOfGame) {
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
        }).populate('user', 'name email').exec(cb);
    },
    findByName: function (name, cb) {
        this.find({ 
            name: new RegExp(name, 'i') }, cb);
    }
};

mongoose.model('Game', GameSchema);