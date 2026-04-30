import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: Number
    },
    time: {
        type: Number
    }
}, { timestamps: true });

const History = mongoose.model('History', historySchema);

export default History;
