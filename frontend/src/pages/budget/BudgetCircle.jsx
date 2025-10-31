import React from "react";
const BudgetCircle = ({ totalIncome, totalExpense }) => {
    const percentage = totalIncome > 0 ? (totalExpense / totalIncome) : 0;
    const radius = 42;
    const circumference = Math.PI * 2 * radius;
    const offset = circumference * (1 - Math.min(percentage, 1));

    return (
        <div className="bg-card p-4 rounded-lg border shadow-sm flex flex-col gap-3 items-center">
            <p className="text-sm font-medium">Budget Used</p>
            <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r={radius} strokeWidth="10" className="text-blue-200" stroke="currentColor" fill="none" />
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className={`transition-all duration-700 
              ${percentage > 0.8 ? "text-red-500" : percentage > 0.5 ? "text-yellow-500" : "text-blue-600"}`}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">
                    {totalIncome > 0 ? `${(percentage * 100).toFixed(0)}%` : "0%"}
                </div>
            </div>
        </div>
    );
};

export default BudgetCircle;
