import Transaction from '../models/Transaction.js';

// create new income/expense
export const createTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(transaction);
    } catch (error) {
        next(error);
    }
};

// GET List all transactions for current user
export const getMyTransactions = async (req, res, next) => {
    try {

        const transactions = await Transaction.find({ createdBy: req.user._id })
        res.json(transactions);

    } catch (error) {

        next(error);
    }
};

// update a transaction
export const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true }

        );
        if (!transaction) return res.status(404).json('Transaction not found');
        res.json(transaction);

    } catch (error) {
        next(error);
    }
};

// DELETE a transaction
export const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id
        });
        if (!transaction) return res.status(404).json('Transaction not found');
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        next(error);
    }
};

// Get transaction monthly summary
export const getMonthlySummary = async (req, res, next) => {
    try {
        const { month, year } = req.query;
        const now = new Date();
        const m = month ? parseInt(month) - 1 : now.getMonth();
        const y = year ? parseInt(year) : now.getFullYear();

        const start = new Date(y, m, 1);
        const end = new Date(y, m + 1, 0);

        const summary = await Transaction.aggregate([
            {
                $match: {
                    createdBy: req.user._id,
                    date: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { category: '$category', status: '$status' },
                    total: { $sum: '$amount' }
                }
            }
        ]);

        res.json(summary);
    } catch (error) {
        next(error);
    }
};
