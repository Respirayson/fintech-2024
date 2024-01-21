import mongoose from 'mongoose';

const ListedPolicySchema = new mongoose.Schema({
    policyId: {
        type: String,
        required: false
    },
    publicAddressOwner: {
        type: String,
        required: true
    },
    publicAddressAgent: {
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
    },
    listed: {
        type: Boolean,
        required: true,
        default: true
    }
});

const ListedPolicy = mongoose.model('ListedPolicy', ListedPolicySchema);

export default ListedPolicy;
