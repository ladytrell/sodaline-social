const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  addThought,
  updateThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts/<userId>/<thoughtId>/<reactions>
router.route('/:thoughtId/reactions')
  .put(addReaction)
  .delete(removeReaction);

// /api/thoughts/<thoughtId>
router.route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);

// /api/thoughts/
router.route('/')
  .get(getAllThoughts)
  .post(addThought);

module.exports = router;
