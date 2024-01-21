import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  publicAddress: { 
    type: String, 
    required: true 
  }
});

const Agent = mongoose.model('Agent', AgentSchema);

export default Agent;
