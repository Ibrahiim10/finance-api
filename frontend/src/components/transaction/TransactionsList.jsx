import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import BudgetCircle from '../../pages/budget/BudgetCircle';
import TransactionGrid from './TransactionGrid';

const COLORS = [
    "#4f46e5", "#16a34a", "#dc2626", "#eab308",
    "#06b6d4", "#9333ea", "#f97316", "#64748b"
];

const TransactionsList = ({ transactions = [], onEdit, onDelete, onStatusChange }) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    // ✅ SEARCH FILTER
    const filtered = transactions.filter(transaction =>
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // ✅ Calculate totals
    const incomeList = filtered.filter(transaction => transaction.status === "income");
    const expenseList = filtered.filter(transaction => transaction.status === "expense");

    const totalIncome = incomeList.reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalExpense = expenseList.reduce((acc, transaction) => acc + transaction.amount, 0);

    // ✅ FIXED: Sum transaction amounts per category
    const categoryAmounts = filtered.reduce((acc, transaction) => {
        if (transaction.category) {
            acc[transaction.category] =
                (acc[transaction.category] || 0) + transaction.amount;
        }
        return acc;
    }, {});

    const pieData = Object.entries(categoryAmounts).map(([category, amount]) => ({
        name: category,
        value: amount,
    }));


    // ✅ Monthly Income vs Expense Trend
    const monthlyData = useMemo(() => {
        const map = {};

        filtered.forEach(transaction => {
            if (!transaction.date) return;
            const month = new Date(transaction.date).toLocaleString("default", { month: "short", year: "2-digit" });

            if (!map[month]) map[month] = { month, income: 0, expense: 0 };
            map[month][transaction.status] += transaction.amount;
        });

        return Object.values(map).sort(
            (a, b) => new Date(a.month) - new Date(b.month)
        );
    }, [filtered]);

    const KPIBox = ({ title, value, icon, positive, negative }) => (
        <div className='bg-card p-4 rounded-lg border shadow-sm'>
            <div className='flex items-center justify-between'>
                <p className={`text-sm font-medium ${positive ? "text-blue-600" : negative ? "text-red-600" : "text-muted-foreground"}`}>
                    {title}
                </p>
                {icon}
            </div>
            <p className={`text-2xl font-bold ${positive ? "text-blue-600" : negative ? "text-red-600" : ""}`}>
                {value}
            </p>
        </div>
    );



    return (
        <div className='space-y-8'>

            {/* KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPIBox title="Total Balance " icon={<Wallet />} value={`$${(totalIncome - totalExpense).toFixed(2)}`} />
                <KPIBox title="Total Income" icon={<TrendingUp />} value={`+$${totalIncome.toFixed(2)}`} positive />
                <KPIBox title="Total Expense" icon={<TrendingDown />} value={`-$${totalExpense.toFixed(2)}`} negative />
                <BudgetCircle totalIncome={totalIncome} totalExpense={totalExpense} />
            </div>

            {/* Monthly Trend */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card p-5 rounded-lg border shadow-sm">
                    <p className="text-sm font-medium mb-4">Income vs Expense Trend</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} />
                            <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Breakdown */}
                <div className="bg-card p-5 rounded-lg border shadow-sm flex flex-col items-center gap-5">
                    <p className="text-sm font-medium">Category Breakdown</p>

                    <PieChart width={330} height={330}>

                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={110}
                            dataKey="value"
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            onClick={(data) =>
                                setSelectedCategory((prev) =>
                                    prev === data.name ? null : data.name
                                )
                            }
                        >
                            {pieData.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={COLORS[i % COLORS.length]}
                                    stroke="#fff"
                                    strokeWidth={2}
                                    cursor="pointer"
                                />
                            ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>

            {/* Transaction Grid */}
            <TransactionGrid
                transactions={selectedCategory ? filtered.filter(t => t.category === selectedCategory) : filtered}
                emptyMessage="No transactions in this category"
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
            />

        </div>
    );
};


export default TransactionsList;
