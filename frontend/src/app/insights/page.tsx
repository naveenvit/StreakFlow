"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { Calendar, BarChart3, PieChart } from "lucide-react";

export default function InsightsPage() {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReportType, setSelectedReportType] = useState<"daily" | "weekly" | "monthly" | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 16 }, (_, i) => 2020 + i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleCardClick = (type: "daily" | "weekly" | "monthly") => {
        setSelectedReportType(type);
        setModalOpen(true);
    };

    const handleViewReport = () => {
        if (!selectedReportType) return;
        setModalOpen(false);
        // the route structure is /insights/[type]?month=...&year=...
        router.push(`/insights/${selectedReportType}?month=${selectedMonth}&year=${selectedYear}&week=1`); // Mocking week=1 for now, or just let weekly report handle it
    };

    return (
        <div className="animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics Insights</h1>
                <p className="text-slate-500 mt-1">Deep dive into your progress and consistency</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    className="cursor-pointer card-hover border-blue-100 bg-gradient-to-br from-white to-blue-50/50"
                    onClick={() => handleCardClick("daily")}
                >
                    <CardHeader>
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                            <BarChart3 size={24} />
                        </div>
                        <CardTitle>Daily Report</CardTitle>
                        <CardDescription>Track day-wise habit completion across all tasks</CardDescription>
                    </CardHeader>
                </Card>

                <Card
                    className="cursor-pointer card-hover border-green-100 bg-gradient-to-br from-white to-green-50/50"
                    onClick={() => handleCardClick("weekly")}
                >
                    <CardHeader>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                            <PieChart size={24} />
                        </div>
                        <CardTitle>Weekly Report</CardTitle>
                        <CardDescription>Analyze weekly goal consistency and accomplishments</CardDescription>
                    </CardHeader>
                </Card>

                <Card
                    className="cursor-pointer card-hover border-purple-100 bg-gradient-to-br from-white to-purple-50/50"
                    onClick={() => handleCardClick("monthly")}
                >
                    <CardHeader>
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                            <Calendar size={24} />
                        </div>
                        <CardTitle>Monthly Report</CardTitle>
                        <CardDescription>Review overall monthly progress and achievements</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md m-4 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="capitalize text-xl">{selectedReportType} Report setup</CardTitle>
                            <CardDescription>Select the time period for your report</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Month</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    >
                                        {months.map((m, i) => (
                                            <option key={m} value={i + 1}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Year</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    >
                                        {years.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t mt-6 border-slate-100">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleViewReport}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    View Report
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
