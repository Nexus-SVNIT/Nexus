const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);

