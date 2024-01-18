import mongoose from 'mongoose';

const UserPolicySchema = new mongoose.Schema({
    tokenId: {
        type: Number,
        required: true
    },
    publicAddress: {
        type: String,
        required: true
    },
    issuerName: {
        type: String,
        required: true
    },
    policyName: {
        type: String,
        required: true
    },
    policyType: {
        type: String,
        required: true
    },
    premium: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    maturityDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    timeCreated: {
        type: Date,
        required: true
    },
    type : {
        type: Number,
        required: true
    }
});

const UserPolicy = mongoose.model('UserPolicy', UserPolicySchema);

export default UserPolicy;
