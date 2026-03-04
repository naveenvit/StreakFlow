"use client";

import { useState } from "react";
import { format } from "date-fns";
import HabitTrackerTable from "@/components/HabitTrackerTable";
import WeeklyGoals from "@/components/WeeklyGoals";
import MonthlyGoals from "@/components/MonthlyGoals";

export default function PlannerPage() {
    const [currentDate] = useState<Date>(new Date());

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {format(currentDate, "MMMM yyyy")}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Track your habits and crush your goals
                    </p>
                </div>
            </header>

            <section>
                <HabitTrackerTable date={currentDate} />
            </section>

            <section className="flex flex-col md:flex-row gap-8">
                <WeeklyGoals date={currentDate} />
                <MonthlyGoals date={currentDate} />
            </section>
        </div>
    );
}
