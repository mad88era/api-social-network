const { Thought, User } = require('../models');

const thoughtsController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .sort({ createdAt: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Unable to fetch thoughts' });
      });
  },

  // Get one thought by id
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.error(err);
        res.status(400).json({ error: 'Error retrieving thought' });
      });
  },

  // Create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then(dbThoughtData => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id' });
        }
        res.status(201).json({ message: 'Thought successfully created' });
      })
      .catch(err => res.status(400).json({ error: 'Failed to create thought' }));
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json({ error: 'Failed to update thought' }));
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id' });
        }
        return User.findOneAndUpdate(
          { _id: dbThoughtData.userId },
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).json({ message: 'Thought successfully deleted' });
      })
      .catch(err => res.status(400).json({ error: 'Failed to delete thought' }));
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought found with this id' });
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json({ error: 'Failed to add reaction' }));
  },

  // Remove a reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought found with this id' });
      }
      res.json({ message: 'Reaction successfully removed' });
    })
    .catch(err => res.status(400).json({ error: 'Failed to remove reaction' }));
  }
};

module.exports = thoughtsController;