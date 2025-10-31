import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DashboardWelcome from '../../components/dashboard/DashboardWelcome'
import TransactionForm from '../../components/transaction/TransactionForm'
import TransactionsList from '../../components/transaction/TransactionsList'
import api from '../../lib/api/apiClient'

const DashboardPage = () => {
    const [showForm, setShowForm] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)
    const queryClient = useQueryClient()

    const handleFormClose = () => {
        setShowForm(false)
        setEditingTransaction(null)
    }

    const handleAddClick = () => {
        setShowForm(true)
    }

    const transactionsQuery = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await api.get('/transactions')
            return res.data
        },
        retry: 1,
    })

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction)
        setShowForm(true)
    }

    const handleDelete = async (transactionId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirmDelete) return;

        try {
            queryClient.setQueryData(['transactions'], old =>
                old.filter(t => t._id !== transactionId)
            );

            await api.delete(`/transactions/${transactionId}`);
            toast("✅ Transaction deleted successfully!");
        } catch (error) {
            console.error("Failed to delete transaction:", error);
            queryClient.invalidateQueries(['transactions']);
        }
    };

    // ✅ Calculate balance from fetched data
    const totalIncome = transactionsQuery.data?.reduce(
        (acc, transaction) => transaction.status === 'income' ? acc + Number(transaction.amount) : acc,
        0
    ) || 0

    const totalExpense = transactionsQuery.data?.reduce(
        (acc, transaction) => transaction.status === 'expense' ? acc + Number(transaction.amount) : acc,
        0
    ) || 0

    const totalBalance = totalIncome - totalExpense

    if (transactionsQuery.isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <Loader className='animate-spin' />
            </div>
        )
    }

    if (transactionsQuery.isError) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <p className='text-red-500'>
                    Error: {transactionsQuery.error.message}
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />

            <main className='max-w-7xl mx-auto px-4 py-8 space-y-6'>

                {/* Dashboard Welcome */}
                <DashboardWelcome
                    totalBalance={totalBalance}
                    onAddTransaction={handleAddClick}
                />

                {/* List Section */}
                <div>
                    <TransactionsList
                        transactions={transactionsQuery.data || []}
                        onDelete={handleDelete}
                        onEdit={handleEditTransaction}
                    />
                </div>
            </main>

            {/* Transaction Form */}
            <TransactionForm
                transaction={editingTransaction}
                open={showForm || !!editingTransaction}
                onOpenChange={handleFormClose}
            />
        </div>
    )
}

export default DashboardPage