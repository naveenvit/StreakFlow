import { useState, useEffect } from "react";
import { Check, Plus } from "lucide-react";
import API from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

interface MonthlyGoal {
    _id: string;
    goal: string;
    completed: boolean;
}

interface Props {
    date: Date;
}

export default function MonthlyGoals({ date }: Props) {
    const [goals, setGoals] = useState<MonthlyGoal[]>([]);
    const [newGoal, setNewGoal] = useState("");

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await API.get(`/goals/monthly?year=${year}&month=${month}`);
                setGoals(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchGoals();
    }, [year, month]);

    const handleAdd = async () => {
        if (!newGoal.trim()) return;
        try {
            const res = await API.post("/goals/monthly", {
                goal: newGoal,
                month,
                year
            });
            setGoals([...goals, res.data]);
            setNewGoal("");
        } catch (e) {
            console.error(e);
        }
    };

    const toggleGoal = async (id: string) => {
        try {
            const res = await API.put(`/goals/monthly/${id}`);
            setGoals(goals.map(g => g._id === id ? res.data : g));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-lg">Monthly Goals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="New monthly goal"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="space-y-2">
                    {goals.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">No goals for this month yet.</p>
                    ) : (
                        goals.map(goal => (
                            <div
                                key={goal._id}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${goal.completed
                                        ? "bg-green-50/50 border-green-100"
                                        : "bg-white border-slate-100 hover:border-slate-200"
                                    }`}
                            >
                                <button
                                    onClick={() => toggleGoal(goal._id)}
                                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${goal.completed ? "bg-green-500 text-white" : "border-2 border-slate-300 text-transparent hover:border-slate-400"
                                        }`}
                                >
                                    <Check size={12} strokeWidth={3} className={goal.completed ? "opacity-100" : "opacity-0"} />
                                </button>
                                <span className={`text-sm font-medium ${goal.completed ? "text-green-700 line-through opacity-70" : "text-slate-700"}`}>
                                    {goal.goal}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
