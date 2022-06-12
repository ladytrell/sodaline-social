const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
  {
  }
);

const ThoughtSchema = new Schema(
  {
  }
);

ThoughtSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
