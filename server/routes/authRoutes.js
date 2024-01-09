import express from 'express';
import * as dotenv from 'dotenv';
import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import jwt from 'jsonwebtoken';

import User from '../mongodb/models/user.js';

dotenv.config();

const router = express.Router();

/**
 * POST route for user authentication and login
 * @route POST /api/v1/auth
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.route('/').post(async (req, res) => {
  // Extract the signature and publicAddress from the request body
  const { signature, publicAddress } = req.body;

  if (!signature || !publicAddress) {
    // Check if both signature and publicAddress are provided in the request
    res
      .status(400)
      .send({ error: 'Request should have signature and publicAddress' });
    return;
  }

  // Find the user based on the provided publicAddress
  let user = await User.findOne({ publicAddress });

  if (!user) {
    // If user is not found, return an error response
    res.status(401).send({
      error: `User with publicAddress ${publicAddress} is not found in database`,
    });
    return;
  }

  // Message to be signed by the user for verification
  const msg = `By proceeding, you agree to the following terms and conditions:

            1. You will comply with the provided terms.
            2. You will use the service lawfully and responsibly.
            3. Intellectual property rights belong to their respective owners.
            4. Your personal information will be handled as per our Privacy Policy.
            5. We are not liable for inaccuracies; use the service at your own risk.
            6. These terms may be modified without prior notice.
            
            By signing your one-time nonce: ${user.nonce}, you confirm your understanding and acceptance of these terms and conditions.`;

  // Convert the message to hex format
  const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));

  // Use eth-sig-util to recover the address from the signature
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });

  // Verify if the recovered address matches the provided publicAddress
  if (address.toLowerCase() === publicAddress.toLowerCase()) {
    // If the verification is successful, generate a JWT token for the user
    user.nonce = Math.floor(Math.random() * 10000);
    user = await user.save();
    const token = jwt.sign(
      {
        id: user.id,
        address: user.publicAddress,
      },
      process.env.JWT_SECRET,
      { expiresIn: '6h' },
    );
    res.status(200).json({
      success: true,
      token,
      user,
      msg: 'You are now logged in.',
    });
  } else {
    // If verification fails, return an error response
    res.status(401).send({
      error: 'Signature verification failed',
    });
  }
});

/**
 * POST route for verifying a JWT token
 * @route POST /api/v1/auth/verify
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.route('/verify').post(async (req, res) => {
  // Extract the JWT token from the request body
  const { token } = req.body;
  let payload;
  try {
    // Verify the token using the JWT_SECRET
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // If the token is invalid, return an error response
      res.status(401).json({ error: 'Invalid token' });
    }
    // If there's any other error, return a bad request response
    res.status(400).json({ error: 'Bad request' });
  }
  // If verification is successful, send the payload as the response
  res.send(payload);
});

// Export the router
export default router;
