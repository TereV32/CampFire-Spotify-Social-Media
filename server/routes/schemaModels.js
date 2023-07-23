const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userProfileSchemea = new Schema({
    username: { type: String, required: true },
    spotifyUserHref: { type: String, required: true, unique: true}
});

const postSchema = new Schema({
    userID: {type: String, required: true},
    content: {type: String, required: true},
    songID: {type: String, required: true},
    timeStamp: {type: String, required: true}
})

const UsersProfile = mongoose.model('UsersProfile', userProfileSchemea, 'userProfile')
const PostSchema = mongoose.model('PostSchema', postSchema, 'postSchema' )
const mySchemas = { 'UsersProfile': UsersProfile, 'PostSchema': PostSchema }

module.exports = mySchemas;