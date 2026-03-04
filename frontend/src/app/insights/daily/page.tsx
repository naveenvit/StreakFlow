"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { format } from "date-fns";

function DailyReportContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const month = searchParams.get("month") || new Date().getMonth() + 1;
    const year = searchParams.get("year") || new Date().getFullYear();

    const [data, setData] = useState<{ overallSuccess: number, taskWise: any[] } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await API.get(`/analytics/daily?year=${year}&month=${month}`);
                setData(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [month, year]);

    if (!data) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading daily report...</div>;

    const monthName = format(new Date(Number(year), Number(month) - 1, 1), "MMMM yyyy");

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daily Report</h1>
                <p className="text-slate-500 mt-1">{monthName}</p>
            </header>

            <Card className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-12 -translate-y-12">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
                </div>
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between relative z-10">
                    <div>
                        <h2 className="text-blue-100 font-medium text-lg">Overall Success</h2>
                        <p className="text-blue-50 text-sm mt-1">Based on all daily habit tasks</p>
                    </div>
                    <div className="text-6xl font-bold mt-4 md:mt-0 tracking-tighter">
                        {data.overallSuccess}%
                    </div>
                </CardContent>
            </Card>

            <h3 className="text-xl font-semibold mb-4 text-slate-800">Task-wise Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.taskWise.length === 0 ? (
                    <p className="text-slate-500 col-span-2 py-8 text-center bg-white rounded-2xl border border-slate-100">No habits tracked this month.</p>
                ) : (
                    data.taskWise.map(task => (
                        <Card
                            key={task.habit_id}
                            className="cursor-pointer card-hover overflow-hidden group border-slate-100"
                            onClick={() => router.push(`/insights/task/${task.habit_id}?month=${month}&year=${year}`)}
                        >
                            <CardContent className="p-5 flex items-center justify-between">
                                <span className="font-medium text-slate-800">{task.habit_name}</span>
                                <div className="flex items-center gap-3">
                                    <div className="text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {task.completion}% <span className="font-normal opacity-80 ml-1">Completion</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

export default function DailyReportPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500 animate-pulse">Loading daily report...</div>}>
            <DailyReportContent />
        </Suspense>
    );
}
