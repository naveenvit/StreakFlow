"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import API from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import {
    PieChart, Pie, Cell, Tooltip as PieTooltip,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer
} from "recharts";

function TaskDetailReportContent() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const [data, setData] = useState<{
        habit_name: string;
        pieChart: { done: number, missed: number };
        lineChart: { day: number, status: number }[];
    } | null>(null);

    useEffect(() => {
        if (!id || !month || !year) return;
        const fetchData = async () => {
            try {
                const res = await API.get(`/analytics/task/${id}?year=${year}&month=${month}`);
                setData(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [id, month, year]);

    if (!data || !month || !year) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading task report...</div>;

    const monthName = format(new Date(Number(year), Number(month) - 1, 1), "MMMM yyyy");

    const pieData = [
        { name: 'Done', value: data.pieChart.done, color: '#3b82f6' }, // blue-500
        { name: 'Missed', value: data.pieChart.missed, color: '#e2e8f0' } // slate-200
    ];

    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border text-sm border-slate-100 p-2 shadow-lg rounded-lg">
                    <span className="font-semibold text-slate-800">{payload[0].name}:</span> {payload[0].value} days
                </div>
            );
        }
        return null;
    };

    const CustomLineTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const isDone = payload[0].value === 1;
            return (
                <div className="bg-white border text-sm border-slate-100 p-3 shadow-lg rounded-lg">
                    <p className="font-semibold mb-1 text-slate-800">Day {label}</p>
                    <p className="flex items-center gap-2">
                        Status:
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isDone ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {isDone ? 'Done' : 'Missed'}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{data.habit_name}</h1>
                <p className="text-slate-500 mt-1">Daily Report &mdash; {monthName}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Completion Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <PieTooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-6 mt-4 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-slate-700">Done ({data.pieChart.done})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                <span className="text-sm font-medium text-slate-700">Missed ({data.pieChart.missed})</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Day-wise Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72 w-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.lineChart} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[0, 1]}
                                        ticks={[0, 1]}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => val === 1 ? 'Done' : 'Missed'}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <LineTooltip content={<CustomLineTooltip />} />
                                    <Line
                                        type="stepAfter"
                                        dataKey="status"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, fill: '#2563eb', strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function TaskDetailReport() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500 animate-pulse">Loading task report...</div>}>
            <TaskDetailReportContent />
        </Suspense>
    );
}
