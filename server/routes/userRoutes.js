// Import required modules and setup environment variables using dotenv.config()
import express from 'express';
import * as dotenv from 'dotenv';

// Import the User model from MongoDB
import User from '../mongodb/models/user.js';

dotenv.config();

// Create an Express Router
const router = express.Router();

/**
 * GET route for retrieving a user by public address
 * @route GET /api/v1/users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.route('/').get((req, res) => {
  // Get the publicAddress from the query parameters
  const publicAddress = req.query;

  // Find the user by the provided publicAddress
  User.findOne(publicAddress)
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

/**
 * POST route for creating a new user
 * @route POST /api/v1/users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.route('/').post((req, res) => {
  // Create a new user based on the request body data
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => console.log(err));
});

// Export the router
export default router;
