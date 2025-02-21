"use client";
import { useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis,
} from "recharts";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dummyWeeklyStats = [500, 700, 800, 650, 900, 750, 820];
const dummyOverallStats = {
    today: {
        Deposits: 145.9,
        Loans: 116.1,
        Profit: 6.4,
        Assets: 183.7,
        Accounts: 6.7,
    },
    month: {
        Deposits: 145.9,
        Loans: 116.1,
        Profit: 6.4,
        Assets: 183.7,
        Accounts: 6.7,
    },
    year: {
        Deposits: 145.9,
        Loans: 116.1,
        Profit: 6.4,
        Assets: 183.7,
        Accounts: 6.7,
    },
};

const DashboardPageComp: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleRetry = () => {
        setLoading(false);
        setError(null);
    };

    const chartData = daysOfWeek.map((day, index) => ({
        name: day,
        Transactions: dummyWeeklyStats[index],
    }));

    const TableData = [
        {
            name: "Deposits (in billion Birr)",
            today: dummyOverallStats.today.Deposits,
            month: dummyOverallStats.month.Deposits,
            year: dummyOverallStats.year.Deposits,
        },
        {
            name: "Loans (in billion Birr)",
            today: dummyOverallStats.today.Loans,
            month: dummyOverallStats.month.Loans,
            year: dummyOverallStats.year.Loans,
        },
        {
            name: "Profit (in billion Birr)",
            today: dummyOverallStats.today.Profit,
            month: dummyOverallStats.month.Profit,
            year: dummyOverallStats.year.Profit,
        },
        {
            name: "Assets (in billion Birr)",
            today: dummyOverallStats.today.Assets,
            month: dummyOverallStats.month.Assets,
            year: dummyOverallStats.year.Assets,
        },
        {
            name: "Accounts (in million)",
            today: dummyOverallStats.today.Accounts,
            month: dummyOverallStats.month.Accounts,
            year: dummyOverallStats.year.Accounts,
        },
    ];

    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
        active,
        payload,
        label,
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-2 bg-white dark:bg-gray-800 border rounded-md text-black dark:text-white">
                    <p className="font-bold">{label}</p>
                    <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="relative lg:p-6 flex flex-col gap-2 md:gap-5">
            <h1 className="md:text-2xl text-xl font-bold">Dashen Bank Dashboard</h1>

            {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    Loading...
                </div>
            ) : error ? (
                "Error"
            ) : (
                <>
                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "20px",
                        }}
                    >
                        <h2 className="text-lg">Weekly Transactions Report</h2>
                        <div className="-ml-10 md:ml-0 mt-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="Transactions"
                                        stroke="#8884d8"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "20px",
                        }}
                    >
                        <h1 className="text-lg">Financial Overview</h1>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: "20px",
                            }}
                        >
                            <thead>
                                <tr className="bg-transparent">
                                    <th className="border">Metric</th>
                                    <th className="border">Today</th>
                                    <th className="border">This Month</th>
                                    <th className="border">This Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TableData.map((entry, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                            {entry.name}
                                        </td>
                                        <td
                                            style={{ border: "1px solid #ddd", padding: "8px" }}
                                            className="text-center"
                                        >
                                            {entry.today}
                                        </td>
                                        <td
                                            style={{ border: "1px solid #ddd", padding: "8px" }}
                                            className="text-center"
                                        >
                                            {entry.month}
                                        </td>
                                        <td
                                            style={{ border: "1px solid #ddd", padding: "8px" }}
                                            className="text-center"
                                        >
                                            {entry.year}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPageComp;
