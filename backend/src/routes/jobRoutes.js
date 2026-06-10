const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob } = require('../controllers/jobController');
const { protect, resolveTenant } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(resolveTenant, getJobs)
  .post(protect, authorize('Admin', 'HR'), createJob);

router.route('/:id')
  .get(resolveTenant, getJobById)
  .put(protect, authorize('Admin', 'HR'), updateJob);

module.exports = router;
