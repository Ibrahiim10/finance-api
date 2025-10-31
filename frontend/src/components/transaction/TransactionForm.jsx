import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../lib/api/apiClient';
import { extractErrorMessage } from '../../util/errorUtils';

const TRANSACTION_STATUS = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
];

const CATEGORIES = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Salary',
    'Freelance',
    'Other',
];

const TransactionForm = ({ transaction, open = false, onOpenChange }) => {
    // state values
    const [values, setValues] = useState({
        title: '',
        amount: '',
        status: 'expense',
        category: '',
        notes: '',
        date: '',
    });

    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        if (transaction) {
            setValues({
                title: transaction.title || '',
                amount: transaction.amount || '',
                status: transaction.status || 'expense',
                category: transaction.category || '',
                notes: transaction.notes || '',
                date: transaction.date
                    ? new Date(transaction.date).toISOString().split('T')[0]
                    : '',
            });
        } else {
            setValues({
                title: '',
                amount: '',
                status: 'expense',
                category: '',
                notes: '',
                date: '',
            });
        }

        setValidationError(null);
    }, [transaction, open]);

    const handleInputChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (value) => {
        setValues({ ...values, status: value });
    };

    const handleCategoryChange = (value) => {
        setValues((values) => ({
            ...values,
            category: value,
        }));
    };

    const handleCancel = () => {
        onOpenChange(false);
    }

    const queryClient = useQueryClient();

    // ✅ Create Transaction
    const createTransMutation = useMutation({
        mutationFn: async (transData) => {
            const response = await api.post('/transactions', transData);
            return response.data;
        },
        onSuccess: () => {
            toast.success('✅ Transaction created!');
            queryClient.invalidateQueries(['transactions']);
            onOpenChange(false);
            setValues({
                title: '',
                amount: '',
                status: 'expense',
                category: '',
                notes: '',
                date: '',
            });
        },
        onError: (error) => {
            console.error('❌ Error creating transaction:', error);
            toast.error(`❌ Error creating transaction: ${extractErrorMessage(error)}`, {
                description: 'Please try again',
            });
            setValidationError(extractErrorMessage(error));
        },
    });

    // ✅ Update Transaction
    const updateTransMutation = useMutation({
        mutationFn: async (transData) => {
            const response = await api.put(
                `/transactions/${transaction._id}`,
                transData
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success('✅ Transaction updated!');
            queryClient.invalidateQueries(['transactions']);
            onOpenChange(false);
            setValues({
                title: '',
                amount: '',
                status: 'expense',
                category: '',
                notes: '',
                date: '',
            });
            console.log('✅ Transaction updated successfully');
        },
        onError: (error) => {
            console.error('Error updating transaction:', error);
            toast.error(
                `❌ Error updating transaction: ${extractErrorMessage(error)}`,
                { description: 'Please try again' }
            );
            setValidationError(extractErrorMessage(error));
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!values.title || !values.amount || !values.date || !values.category) {
            setValidationError('All fields are required');
            return;
        }

        const transData = {
            ...values,
            amount: Number(values.amount),
        };

        transaction
            ? updateTransMutation.mutate(transData)
            : createTransMutation.mutate(transData);
    };

    // Ged display Error from validation or mutation error

    const displayError =
        validationError || extractErrorMessage(createTransMutation.error);
    // extractErrorMessage(updateTaskMutation.error)

    const isLoading =
        createTransMutation.isPending || updateTransMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                    </DialogTitle>
                    <DialogDescription>
                        Track your income and expenses easily.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* display error */}
                    {displayError && (
                        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                            {displayError}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            name="title"
                            value={values.title}
                            onChange={handleInputChange}
                            placeholder="Salary, Food, Bus fare..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Amount ($)</Label>
                        <Input
                            type="number"
                            name="amount"
                            value={values.amount}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={values.status} onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                {TRANSACTION_STATUS.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={values.category}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            name="date"
                            value={values.date}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                            name="notes"
                            value={values.notes}
                            onChange={handleInputChange}
                            placeholder="Optional details..."
                        />
                    </div>

                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline" onClick={handleCancel} className="cursor-pointer">

                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className='flex items-center gap-2'>
                                    <Loader size="sm" />
                                    {transaction ? 'Updating...' : 'Create transaction'}
                                </span>
                            ) : (
                                transaction ? 'Update transaction' : 'Create transaction'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionForm;
