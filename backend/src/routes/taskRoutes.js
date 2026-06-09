const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTaskStatus,
  reviewTask,
  getEmployeeTaskMetrics
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, authorize('Admin', 'HR', 'Manager'), createTask)
  .get(protect, getTasks);

// IMPORTANT: /performance/:userId must be defined BEFORE /:id/* routes
// so Express doesn't match the literal string 'performance' as a task :id
router.route('/performance/:userId')
  .get(protect, getEmployeeTaskMetrics);

router.route('/:id/status')
  .put(protect, updateTaskStatus);

router.route('/:id/review')
  .put(protect, authorize('Admin', 'HR', 'Manager'), reviewTask);

module.exports = router;
