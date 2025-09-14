const express = require('express');
const {
  getTips,
  createTip,
  likeTip,
  dislikeTip,
  rateTip,
  addComment,
  deleteTip,
  getTip
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected except getting tips
router.get('/tips', getTips);
router.get('/tips/:id', getTip);

// Protected routes
router.use(protect);

router.post('/tips', createTip);
router.put('/tips/:id/like', likeTip);
router.put('/tips/:id/dislike', dislikeTip);
router.put('/tips/:id/rating', rateTip);
router.post('/tips/:id/comments', addComment);
router.delete('/tips/:id', deleteTip);


module.exports = router;