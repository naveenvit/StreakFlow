"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    // Don't show anything on the login/signup page if not logged in
    if (pathname === "/" && !user) return null;

    return (
        <nav className="w-full bg-white border-b border-border shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center">
                <Link href="/planner" className="text-xl font-bold text-slate-800 tracking-tight">
                    StreakFlow
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {pathname === "/planner" ? (
                    <>
                        <Link
                            href="/insights"
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Insights
                        </Link>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        Back
                    </button>
                )}
            </div>
        </nav>
    );
}
