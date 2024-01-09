import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nonce: { type: String, required: true, default: Math.floor(Math.random() * 100000) },
  publicAddress: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

export default User;
