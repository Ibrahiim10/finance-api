import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet } from "lucide-react";
import TransactionCard from "./TransactionCard";

const TransactionGrid = ({ transactions = [], emptyMessage, onEdit, onDelete, onStatusChange }) => {

    if (transactions.length === 0) {
        return (
            <div className='text-center py-12'>
                <div className='mx-auto max-w-md'>
                    <Wallet className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                    <h3 className='mt-4 text-sm text-muted-foreground'>No transactions found</h3>
                    <p className='mt-2 text-sm text-muted-foreground'>{emptyMessage}</p>
                </div>
            </div>
        )
    }

    <div className='grid grid-cols-1 md:grid-cols- 2 lg:grid-cols-3 gap-4'>

        {
            transactions.map(transaction => (
                <TransactionCard
                    key={transaction._id}
                    transaction={transaction}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                />
            ))
        }

    </div>


    const getAmountColor = (status) => {
        if (status === "income") return "text-blue-600 font-semibold";
        if (status === "expense") return "text-red-600 font-semibold";
        return "text-gray-600 font-semibold";
    };


    return (
        <div className="rounded-md border bg-card shadow-sm">
            <div className="px-6 py-4 border-b border-muted-foreground/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Transactions
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    List of all your transactions
                </p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map(transaction => (
                        <TableRow key={transaction._id}>
                            <TableCell className={getAmountColor(transaction.status)}>
                                ${transaction.amount?.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{transaction.category}</Badge>
                            </TableCell>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={(transaction.status)}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        onStatusChange(transaction._id, (transaction.status))
                                    }
                                >
                                    {transaction.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => onEdit(transaction)}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(transaction._id)}>
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TransactionGrid;