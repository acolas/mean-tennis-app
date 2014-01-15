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
        _id: String,
        score: Number,
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    },
    score: {
        scoreOpponent1 : [Number],
        scoreOpponent2 : [Number]
    },
    opponentId: String,
    created : {
        type : Date,
        default : Date.now
    },
    details : {
        typeOfGame: {
            type: String,
            enum: ['Match', 'Tie-Break']},
        official: Boolean,
        points: Number,
        victory: Boolean,
        surface: {
            type: String,
            enum: ['Dur','Gazon','Indoor','Moquette','Parquet', 'Synthétique', 'Terre battue'],
            default: 'Terre battue'
        }
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

/*GameSchema.path('opponentUser').validate(function(opponentUser) {
    return opponentUser.length;
}, 'opponentUser opponentUser be blank');*/

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
        }).populate('user opponent.user', 'firstName lastName email details.points').exec(cb);
    },
    findByName: function (name, cb) {
        this.find({ 
            name: new RegExp(name, 'i') }, cb);
    }
};

mongoose.model('Game', GameSchema);