import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['income', 'expense'],
            default: 'income',
        },
        category: { type: String, required: true },
        date: { type: Date, required: true },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },

    { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
