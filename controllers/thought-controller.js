const { Thought, User } = require('../models');

const thoughtController = {
    //add thought to user
    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
          .then(({ _id }) => {
            return User.findOneAndUpdate(
              { _id: body.userId },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },

    // get all users
    getAllThoughts(req, res) {
      Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
          console.log(err);
          res.status(400).json(err);
      });
    },

    // get one thought by id
    getThoughtById({ params }, res) {
      Thought.findOne({ _id: params.id })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbThoughtData => {
          // If no thought is found, send 404
          if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
          }
          res.json(dbThoughtData);
      })
      .catch(err => {
          console.log(err);
          res.status(400).json(err);
      });
    },

    updateThought({ params, body }, res) {
      Thought.findOneAndUpdate(
        { _id: params.id }, 
        body, 
        { new: true, runValidators: true })
      .then(dbThoughtData => {
          if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
          }
          res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
    },

    // remove thought
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then(deletedThought => {
            console.log('deletedThought', deletedThought);
            if (!deletedThought) {
              return res.status(404).json({ message: 'No thought with this id!' });
            }
            return User.findOneAndUpdate(
              { userName: deletedThought.userName },
              { $pull: { thoughts: params.id } },
              { new: true }
            );
          })
          .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      )
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));  
    },

    // remove reaction
    removeReaction({ params, body  }, res) {
       Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: body.reactionId } } },
          { new: true }
        )
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.json(err));
    }
};

module.exports = thoughtController;