import { useState, useEffect } from "react";
import { format, getDaysInMonth, startOfMonth, getWeek, addDays } from "date-fns";
import { Check, X, Plus } from "lucide-react";
import API from "@/lib/api";

interface Habit {
    _id: string;
    habit_name: string;
}

interface HabitLog {
    _id: string;
    habit_id: string;
    date: string;
    completed: boolean;
}

interface Props {
    date: Date;
}

export default function HabitTrackerTable({ date }: Props) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [newHabit, setNewHabit] = useState("");

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12
    const daysInMonth = getDaysInMonth(date);
    const monthStart = startOfMonth(date);

    const fetchHabits = async () => {
        try {
            const res = await API.get("/habits");
            setHabits(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await API.get(`/habits/logs?year=${year}&month=${month}`);
            setLogs(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchHabits();
        fetchLogs();
    }, [year, month]);

    const handleAddHabit = async () => {
        if (!newHabit.trim()) return;
        try {
            const res = await API.post("/habits", { habit_name: newHabit });
            setHabits([...habits, res.data]);
            setNewHabit("");
        } catch (e) {
            console.error(e);
        }
    };

    const toggleLog = async (habitId: string, day: number) => {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const logIndex = logs.findIndex(l => l.habit_id === habitId && l.date === dateStr);
        const completed = logIndex >= 0 ? !logs[logIndex].completed : true;

        try {
            const res = await API.post("/habits/logs", {
                habit_id: habitId,
                date: dateStr,
                completed
            });

            const newLogs = [...logs];
            if (logIndex >= 0) {
                newLogs[logIndex] = res.data;
            } else {
                newLogs.push(res.data);
            }
            setLogs(newLogs);
        } catch (e) {
            console.error(e);
        }
    };

    // Generate headers
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekRow: string[] = [];
    const dayNameRow: string[] = [];

    daysArray.forEach((day, idx) => {
        const curDate = addDays(monthStart, idx);
        // getWeek starts from beginning of year. We can also just count it based on how many Mondays we pass.
        // For simplicity, let's use week of the month by doing Math.ceil((day + startDayOfWeek) / 7)
        // Actually, getWeek gives week of year. We can use that.
        weekRow.push(`Week ${getWeek(curDate)}`);
        dayNameRow.push(format(curDate, "EEE"));
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Daily Habit Tracker</h2>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <input
                        type="text"
                        placeholder="New habit name"
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddHabit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-700 sticky left-0 bg-slate-50/50 border-r border-slate-100 z-10 w-48">Week</th>
                            {daysArray.map((day, i) => (
                                <th key={day} className="px-2 py-3 font-medium text-center border-x border-slate-100/50">{weekRow[i]}</th>
                            ))}
                        </tr>
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-700 sticky left-0 bg-slate-50/50 border-r border-slate-100 z-10">Day</th>
                            {daysArray.map((day, i) => (
                                <th key={day} className="px-2 py-3 font-medium text-center border-x border-slate-100/50">{dayNameRow[i]}</th>
                            ))}
                        </tr>
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-700 sticky left-0 bg-slate-50/50 border-r border-slate-100 z-10">Date</th>
                            {daysArray.map(day => (
                                <th key={day} className="px-2 py-3 font-medium text-center border-x border-slate-100/50">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {habits.length === 0 ? (
                            <tr>
                                <td colSpan={daysInMonth + 1} className="px-6 py-8 text-center text-slate-500">
                                    No habits added yet. Start by adding one above!
                                </td>
                            </tr>
                        ) : (
                            habits.map(habit => (
                                <tr key={habit._id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700 sticky left-0 bg-white border-r border-slate-100 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                        {habit.habit_name}
                                    </td>
                                    {daysArray.map(day => {
                                        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                        const log = logs.find(l => l.habit_id === habit._id && l.date === dateStr);
                                        const isCompleted = log?.completed || false;

                                        return (
                                            <td key={day} className="px-2 py-3 text-center border-x border-slate-50">
                                                <button
                                                    onClick={() => toggleLog(habit._id, day)}
                                                    className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-all ${isCompleted
                                                            ? 'bg-blue-500 text-white shadow-[0_2px_10px_rgba(59,130,246,0.3)]'
                                                            : 'bg-slate-100 hover:bg-slate-200 text-transparent'
                                                        }`}
                                                >
                                                    <Check size={14} className={isCompleted ? "opacity-100" : "opacity-0"} />
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
