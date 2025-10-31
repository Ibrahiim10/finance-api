import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from "react";
import useAuthStore from '../../lib/store/authStore';

const DashboardWelcome = ({ onAddTransaction, totalBalance }) => {
    const { user, isAuthenticated } = useAuthStore();
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        // Format current date nicely
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        setCurrentDate(formattedDate);
    }, []);

    return (
        <Card className="border-0 shadow-sm bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-950">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Welcome section */}
                    <div className="space-y-2 flex flex-col items-start">
                        <CardTitle className="text-2xl font-semibold">
                            Welcome,{" "}
                            <span className="text-blue-700 dark:text-blue-400">
                                {isAuthenticated && user?.name ? user.name.split(" ")[0] : "Guest"}
                            </span>
                            👋
                        </CardTitle>

                        <CardDescription className="text-base text-muted-foreground">
                            {currentDate}
                        </CardDescription>

                        <p className="text-base text-muted-foreground">
                            Track your spending and manage your finances wisely.
                        </p>

                        <p className="text-lg font-semibold text-blue-600">
                            Balance: ${totalBalance?.toFixed(2) ?? 0}
                        </p>
                    </div>

                    {/* Add transaction button */}
                    <Button
                        onClick={onAddTransaction}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                        + Add Transaction
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
};

export default DashboardWelcome;