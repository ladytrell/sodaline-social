const { Thought, User } = require('../models');

const thoughtController = {
    //add thought to user
    // Using async await to perserver the created thought doc for return
    async addThought({ params, body }, res) {
      const dbThoughtData = await Thought.create(body);

      if (dbThoughtData) {     
         const dbUserData = await User.findOneAndUpdate(
             { _id: body.userId },
             { $push: { thoughts: dbThoughtData._id } },
             { new: true }
          ); 
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });            
        }
            return res.json(dbThoughtData);                            
        } else {        
          return res.json(err);
        }
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
            if (!deletedThought) {
              return res.status(404).json({ message: 'No thought with this id!' });
            }
            return User.findOneAndUpdate(
             { userName: deletedThought.userName },
             { $pull: { thoughts: params.id } },
              { new: true }
            );
          })
          .then(thoughtData => {
            res.json({ message: 'Though Deleted!'});
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