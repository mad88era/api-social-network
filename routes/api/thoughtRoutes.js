const express = require('express');
const router = express.Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction
} = require('../../controllers/thoughtsController');

// Routes for handling operations on the collection of thoughts
router.route('/')
  .get(getAllThoughts)  // GET all thoughts
  .post(createThought); // POST a new thought, should return 201 Created on success

// Routes for handling operations on individual thoughts
router.route('/:id')
  .get(getThoughtById)  // GET a single thought by id
  .put(updateThought)   // PUT to update a thought by id, should handle validation errors
  .delete(deleteThought); // DELETE a thought by id, should return 204 No Content on success

// Route to handle adding reactions to a thought
router.route('/:thoughtId/reactions')
  .post(addReaction); // POST to add a reaction to a thought

// Route to handle removing reactions from a thought
router.route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction); // DELETE to remove a reaction by id from a thought, should return 204 No Content on success

module.exports = router;