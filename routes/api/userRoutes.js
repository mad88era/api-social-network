const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

// Routes for general user operations
router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Routes for managing friends
router.route('/:userId/friends/:friendId')
  .post(addFriend)    // POST to add a new friend
  .delete(removeFriend);  // DELETE to remove a friend

module.exports = router;