const express = require('express');
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getDashboardStats,
  getHealthTrends
} = require('../controllers/userController.js');
const { protect, authorize } = require('../middlewares/auth.js');

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/trends', getHealthTrends);

// Custom middleware to allow patients to fetch doctors only
const authorizeUsersList = (req, res, next) => {
  // Allow patients if they're filtering by role='doctor'
  if (req.user.role === 'patient' && req.query.role === 'doctor') {
    return next();
  }
  // Otherwise, require admin or doctor role
  return authorize('admin', 'doctor')(req, res, next);
};

router.get('/', authorizeUsersList, getUsers);
router.get('/:id', authorize('admin', 'doctor'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;

