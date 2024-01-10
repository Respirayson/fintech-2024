import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nonce: { 
    type: String, 
    required: true, 
    default: Math.floor(Math.random() * 100000) 
  },
  publicAddress: { 
    type: String, 
    required: true 
  }, 
  username: {
    type: String,
    required: true,
    default: "New Username"
  },
  name: {
    type: String,
    required: true,
    default: "New User"
  },
  company: {
    type: String,
    required: false,
    default: null
  },
  isUpdated: {
    type: Boolean,
    required: true,
    default: false
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
