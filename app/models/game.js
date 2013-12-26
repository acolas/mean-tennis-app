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
    homeUser: String,
    extUser: String,
    homeScore: Number,
    extScore: Number,
    type: String,
    official: Boolean,
    points: Number
});

GameSchema.path('homeScore').validate(function(homeScore) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return homeScore.length;
}, 'homeScore cannot be blank');

GameSchema.path('extScore').validate(function(extScore) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return extScore.length;
}, 'extScore cannot be blank');



mongoose.model('Game', GameSchema);