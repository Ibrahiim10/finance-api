import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Edit2, Loader, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api/apiClient";

const STATUS_CONFIG = {
    income: {
        color: "text-blue-600",
        variant: "outline",
        label: "Income"
    },
    expense: {
        color: "text-red-600",
        variant: "secondary",
        label: "Expense"
    }
};

const TransactionCard = ({ transaction, onEdit }) => {
    // if (!transaction) return null;

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);


    const statusConfig = STATUS_CONFIG[transaction.status] || STATUS_CONFIG['expense'];

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const queryClient = useQueryClient();

    // ✅ Delete transaction
    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`/transactions/${transaction._id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["transactions"]);
            toast.success("✅ Transaction deleted successfully");
        },
        onError: (error) => {
            toast.error(`Error deleting transaction: ${error.message}`);
        }
    });

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(transaction._id);
            setShowDeleteDialog(false);
        } catch (error) {
            toast.error(`Error confirming delete: ${error.message}`);
        }
    };

    return (
        <>
            <Card className="w-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">
                            {transaction.title}
                        </CardTitle>

                        <div className="flex items-center gap-2">
                            <Badge variant={statusConfig.variant} className={'shrink-0'}>
                                {statusConfig.label}
                            </Badge>

                            {/* dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEdit(transaction)}>
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    {/* Amount */}
                    {
                        transaction.amount && (
                            <p className='text-muted-foreground text-sm leading-relaxed'>{transaction.amount}</p>
                        )
                    }

                    {/* Category */}
                    {transaction.category && (
                        <p className="text-sm text-muted-foreground">
                            Category: <strong>{transaction.category}</strong>
                        </p>
                    )}

                    {/* Date */}
                    {transaction.date && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(transaction.date)}
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className='flex items-center justify-between text-xs text-muted-foreground pt-2 border-t'>
                        <span>Created: {formatDate(transaction.createdAt)}</span>
                        <span className={statusConfig.color}>
                            {statusConfig.label}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Delete confirmation dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. It will permanently delete:
                            <br />
                            "<strong>{transaction.title}</strong>"
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {deleteMutation.isPending ? (
                                <Loader className="animate-spin w-4 h-4" />
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default TransactionCard;
