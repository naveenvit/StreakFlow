"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import API from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

function MonthlyReportContent() {
    const searchParams = useSearchParams();
    const month = searchParams.get("month") || new Date().getMonth() + 1;
    const year = searchParams.get("year") || new Date().getFullYear();

    const [data, setData] = useState<{ overallSuccess: number } | null>(null);
    const [goals, setGoals] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resAnalytics, resGoals] = await Promise.all([
                    API.get(`/analytics/monthly-success?year=${year}&month=${month}`),
                    API.get(`/goals/monthly?year=${year}&month=${month}`)
                ]);
                setData(resAnalytics.data);
                setGoals(resGoals.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [month, year]);

    if (!data) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading monthly report...</div>;

    const monthName = format(new Date(Number(year), Number(month) - 1, 1), "MMMM yyyy");

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Monthly Report</h1>
                <p className="text-slate-500 mt-1">{monthName}</p>
            </header>

            <Card className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 border-none text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-12 -translate-y-12">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                </div>
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between relative z-10">
                    <div>
                        <h2 className="text-purple-100 font-medium text-lg">Overall Success</h2>
                        <p className="text-purple-50 text-sm mt-1">Goals completion rate for the month</p>
                    </div>
                    <div className="text-6xl font-bold mt-4 md:mt-0 tracking-tighter">
                        {data.overallSuccess}%
                    </div>
                </CardContent>
            </Card>

            <h3 className="text-xl font-semibold mb-4 text-slate-800">Goals Overview</h3>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {goals.length === 0 ? (
                            <p className="p-6 text-center text-slate-500">No monthly goals found.</p>
                        ) : (
                            goals.map(goal => (
                                <div key={goal._id} className="p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${goal.completed ? "bg-purple-100 text-purple-600" : "bg-red-100 text-red-600"
                                        }`}>
                                        {goal.completed ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                                    </div>
                                    <div>
                                        <p className={`font-medium ${goal.completed ? "text-slate-900" : "text-slate-700"}`}>{goal.goal}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${goal.completed ? "bg-purple-100/50 text-purple-700" : "bg-red-50 text-red-600"
                                            }`}>
                                            {goal.completed ? "Completed" : "Incomplete"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function MonthlyReportPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500 animate-pulse">Loading monthly report...</div>}>
            <MonthlyReportContent />
        </Suspense>
    );
}
