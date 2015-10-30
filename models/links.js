/**
 * Created by Maguire Krist on 10/28/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSchema = new Schema({
    title: String,
    url: String,
    author: String,
    date: String,
    hidden: Boolean,
    comments: [{ body: String, date: String, author: String, hidden: Boolean }],
    meta: {
        upVote: Number,
        downVote: Number
    }
});

module.exports = mongoose.model('Link', linkSchema);