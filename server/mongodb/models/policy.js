import mongoose from 'mongoose';

const PolicySchema = new mongoose.Schema({
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
    }
});

const Policy = mongoose.model('Policy', PolicySchema);

export default Policy;