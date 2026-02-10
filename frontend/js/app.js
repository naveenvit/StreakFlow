console.log("🔥 APP.JS LOADED ON", window.location.href);
// ================= AUTH GUARD =================

function requireAuth() {
    const token = localStorage.getItem("streakflow_token");

    if (!token) {
        window.location.href = "login.html";
    }
}
// ================= AUTH HEADER HELPER =================

function getAuthHeaders() {
    const token = localStorage.getItem("streakflow_token");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

// ================= COMMON =================

// Get today's date
const today = new Date();

function loadMonthlyGoals() {
    const data = localStorage.getItem("streakflow_monthly_goals");
    return data ? JSON.parse(data) : [];
}

function saveMonthlyGoals(goals) {
    localStorage.setItem(
        "streakflow_monthly_goals",
        JSON.stringify(goals)
    );
}

// ================= DASHBOARD PAGE =================

const isDashboardPage = document.getElementById("taskBody") !== null;

if (isDashboardPage) {

    // Month & Year
    const monthName = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();
    document.getElementById("currentMonth").textContent = `${monthName} ${year}`;

    // Days in month
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Table headers
    const dayRow = document.getElementById("dayRow");
    const daysRow = document.getElementById("daysRow");
    const weekRow = document.getElementById("weekRow");
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let d = 1; d <= daysInMonth; d++) {
        const dateTh = document.createElement("th");
        dateTh.textContent = d;
        daysRow.appendChild(dateTh);

        const tempDate = new Date(year, month, d);
        const dayTh = document.createElement("th");
        dayTh.textContent = dayNames[tempDate.getDay()];
        dayRow.appendChild(dayTh);
    }

    let week = 1;
    let count = 1;
    while (count <= daysInMonth) {
        const th = document.createElement("th");
        th.colSpan = Math.min(7, daysInMonth - count + 1);
        th.textContent = `Week ${week}`;
        weekRow.appendChild(th);
        count += 7;
        week++;
    }

    // ---------- DAILY TASKS ----------
    const taskBody = document.getElementById("taskBody");
    const taskInput = document.getElementById("taskInput");
    // ================= WEEKLY GOALS (BACKEND) =================

    const weeklyGoalsList = document.getElementById("weeklyGoalsList");
    const addWeeklyGoalBtn = document.getElementById("addWeeklyGoal");
    const weeklyGoalInput = document.getElementById("weeklyGoalInput");

    async function fetchWeeklyGoals() {
        try {
            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            const res = await fetch(
                `https://streakflow-backend-uagq.onrender.com/api/goals?type=weekly&month=${month}&year=${year}`,
                {
                    headers: getAuthHeaders()
                }
            );

            const goals = await res.json();

            weeklyGoalsList.innerHTML = "";
            goals.forEach(renderWeeklyGoal);

        } catch (error) {
            console.error("Failed to fetch weekly goals", error);
        }
    }

    function renderWeeklyGoal(goal) {
        const div = document.createElement("div");
        div.className = "goal-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = goal.done;

        checkbox.addEventListener("change", async () => {
            console.log("Weekly checkbox clicked:", checkbox.checked);
            try {
                await fetch(
                    `https://streakflow-backend-uagq.onrender.com/api/goals/${goal._id}`,
                    {
                        method: "PATCH",
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ done: checkbox.checked })
                    }
                );
            } catch (error) {
                console.error("Failed to update goal", error);
            }
        });

        const span = document.createElement("span");
        span.textContent = goal.text;

        div.append(checkbox, span);
        weeklyGoalsList.appendChild(div);
    }


    addWeeklyGoalBtn.addEventListener("click", async () => {
        const text = weeklyGoalInput.value.trim();
        if (!text) return;

        try {
            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            await fetch(`$https://streakflow-backend-uagq.onrender.com/api/goals`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    text,
                    type: "weekly",
                    month,
                    year
                })
            });

            weeklyGoalInput.value = "";
            fetchWeeklyGoals();

        } catch (error) {
            console.error("Failed to add weekly goal", error);
        }
    });
    fetchWeeklyGoals();

    // ================= MONTHLY GOALS (BACKEND) =================
    let monthlyGoals = loadMonthlyGoals();
    const monthlyGoalsList = document.getElementById("monthlyGoalsList");
    const addMonthlyGoalBtn = document.getElementById("addMonthlyGoal");
    const monthlyGoalInput = document.getElementById("monthlyGoalInput");

    async function fetchMonthlyGoals() {
        try {
            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            const res = await fetch(
                `https://streakflow-backend-uagq.onrender.com/api/goals?type=monthly&month=${month}&year=${year}`,
                {
                    headers: getAuthHeaders()
                }
            );

            const goals = await res.json();

            monthlyGoalsList.innerHTML = "";
            goals.forEach(renderMonthlyGoal);

        } catch (error) {
            console.error("Failed to fetch monthly goals", error);
        }
    }

    function renderMonthlyGoal(goal) {
        const div = document.createElement("div");
        div.className = "goal-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = goal.done;

        checkbox.addEventListener("change", async () => {
            console.log("Monthly checkbox clicked:", checkbox.checked);

            try {
                await fetch(
                    `https://streakflow-backend-uagq.onrender.com/api/goals/${goal._id}`,
                    {
                        method: "PATCH",
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ done: checkbox.checked })
                    }
                );

                fetchMonthlyGoals();

            } catch (error) {
                console.error("Failed to update monthly goal", error);
            }
        });

        const span = document.createElement("span");
        span.textContent = goal.text;

        div.append(checkbox, span);
        monthlyGoalsList.appendChild(div);
    }

    addMonthlyGoalBtn.addEventListener("click", async () => {
        const text = monthlyGoalInput.value.trim();
        if (!text) return;

        try {
            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            await fetch(`$https://streakflow-backend-uagq.onrender.com/api/goals`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    text,
                    type: "monthly",
                    month,
                    year
                })
            });

            monthlyGoalInput.value = "";
            fetchMonthlyGoals();

        } catch (error) {
            console.error("Failed to add monthly goal", error);
        }
    });
    fetchMonthlyGoals();


}

// ================= REPORT PAGE =================

const isReportPage = document.querySelector(".report-card") !== null;

if (isReportPage) {

    const reportCards = document.querySelectorAll(".report-card");
    const reportModal = document.getElementById("reportModal");
    const closeModalBtn = document.getElementById("closeModal");
    const modalTitle = document.getElementById("modalTitle");
    const viewReportBtn = document.getElementById("viewReportBtn");

    const monthSelect = document.getElementById("modalMonth");
    const yearSelect = document.getElementById("modalYear");

    let selectedReportType = null;

    // ---------- OPEN MODAL ----------
    reportCards.forEach(card => {
        card.addEventListener("click", () => {
            selectedReportType = card.dataset.type;

            modalTitle.textContent =
                selectedReportType.charAt(0).toUpperCase() +
                selectedReportType.slice(1) + " Report";

            reportModal.classList.remove("hidden");
        });
    });

    // ---------- CLOSE MODAL ----------
    closeModalBtn.addEventListener("click", () => {
        reportModal.classList.add("hidden");
    });

    // ---------- FILL MONTHS ----------
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    months.forEach((m, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = m;
        monthSelect.appendChild(option);
    });

    // ---------- FILL YEARS ----------
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 5; y <= currentYear + 1; y++) {
        const option = document.createElement("option");
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }

    // Default select current month/year
    monthSelect.value = new Date().getMonth();
    yearSelect.value = currentYear;

    // ---------- VIEW REPORT (REDIRECT) ----------
    viewReportBtn.addEventListener("click", () => {
        const month = monthSelect.value;
        const year = yearSelect.value;

        if (!selectedReportType) return;

        window.location.href =
            `report-view.html?type=${selectedReportType}&month=${month}&year=${year}`;
    });
}

// ================= REPORT VIEW PAGE =================
(function () {

    const overallPercentEl = document.getElementById("overallPercent");
    const taskListEl = document.getElementById("taskList");

    if (!overallPercentEl || !taskListEl) return;

    const params = new URLSearchParams(window.location.search);
    const reportType = params.get("type");
    const monthParam = params.get("month"); // 0-based
    const year = params.get("year");

    const apiMonth = Number(monthParam) + 1; // backend expects 1-based

    // ---------- DAILY REPORT ----------
    if (reportType === "daily") {

        console.log("✅ DAILY REPORT CODE RUNNING");

        fetch(
            `https://streakflow-backend-uagq.onrender.com/api/reports/daily?month=${apiMonth}&year=${year}`,
            { headers: getAuthHeaders() }
        )
            .then(res => res.json())
            .then(report => {

                taskListEl.innerHTML = "";

                let total = 0;
                let completed = 0;

                report.forEach(task => {
                    total += task.totalDays;
                    completed += task.completedDays;

                    const card = document.createElement("div");
                    card.className = "task-card";
                    card.innerHTML = `
                        <h4>${task.name}</h4>
                        <p>Completion: ${task.percentage}%</p>
                    `;

                    card.addEventListener("click", () => {
                        window.location.href =
                            `task-report.html?type=daily&taskId=${task.taskId}&month=${month}&year=${year}`;
                    });

                    taskListEl.appendChild(card);
                });

                const overall =
                    total === 0 ? 0 : Math.round((completed / total) * 100);

                overallPercentEl.textContent = overall + "%";
            })
            .catch(err => console.error("Daily report error:", err));
    }

    // ---------- WEEKLY REPORT ----------
    if (reportType === "weekly") {

        fetch(
            `https://streakflow-backend-uagq.onrender.com/api/goals?type=weekly&month=${apiMonth}&year=${year}`,
            { headers: getAuthHeaders() }
        )
            .then(res => res.json())
            .then(goals => {

                taskListEl.innerHTML = "";

                if (goals.length === 0) {
                    overallPercentEl.textContent = "0%";
                    taskListEl.innerHTML =
                        `<p class="muted">No weekly goals found.</p>`;
                    return;
                }

                let completed = 0;

                goals.forEach(goal => {
                    if (goal.done) completed++;

                    const div = document.createElement("div");
                    div.className =
                        "goal-item-report " + (goal.done ? "done" : "not-done");

                    div.innerHTML = `
                        ${goal.done ? "✔" : "✖"} ${goal.text}
                    `;

                    taskListEl.appendChild(div);
                });

                const percent =
                    Math.round((completed / goals.length) * 100);

                overallPercentEl.textContent = percent + "%";
            })
            .catch(err => console.error("Weekly report error:", err));
    }
    // ---------- MONTHLY REPORT ----------
    if (reportType === "monthly") {

        fetch(
            `https://streakflow-backend-uagq.onrender.com/api/goals?type=monthly&month=${apiMonth}&year=${year}`,
            { headers: getAuthHeaders() }
        )
            .then(res => res.json())
            .then(goals => {

                taskListEl.innerHTML = "";

                if (goals.length === 0) {
                    overallPercentEl.textContent = "0%";
                    taskListEl.innerHTML =
                        `<p class="muted">No monthly goals found.</p>`;
                    return;
                }

                let completed = 0;

                goals.forEach(goal => {
                    if (goal.done) completed++;

                    const div = document.createElement("div");
                    div.className =
                        "goal-item-report " + (goal.done ? "done" : "not-done");

                    div.innerHTML = `
                        ${goal.done ? "✔" : "✖"} ${goal.text}
                    `;

                    taskListEl.appendChild(div);
                });

                const percent =
                    Math.round((completed / goals.length) * 100);

                overallPercentEl.textContent = percent + "%";
            })
            .catch(err => console.error("Monthly report error:", err));
    }


})();

// ================= TASK REPORT PAGE =================
(function () {

    const taskTitleEl = document.getElementById("taskTitle");
    const taskMetaEl = document.getElementById("taskMeta");
    const pieCanvas = document.getElementById("taskPieChart");
    const lineCanvas = document.getElementById("taskLineChart");
    const backBtn = document.getElementById("backToReportView");

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            const params = new URLSearchParams(window.location.search);

            const type = params.get("type");
            const month = params.get("month");
            const year = params.get("year");

            window.location.href =
                `report-view.html?type=${type}&month=${month}&year=${year}`;
        });
    }

    if (!taskTitleEl || !taskMetaEl || !pieCanvas || !lineCanvas) return;

    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("taskId");
    if (!taskId) {
        console.warn("No taskId found in URL, skipping task report");
        return;
    }
    const monthParam = params.get("month");
    const year = params.get("year");

    if (!taskId) return;

    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    // Fetch single task
    fetch(`https://streakflow-backend-uagq.onrender.com/api/tasks/${taskId}`, {
        headers: getAuthHeaders()
    })
        .then(res => res.json())
        .then(task => {

            taskTitleEl.textContent = task.name;
            taskMetaEl.textContent =
                `DAILY REPORT · ${months[monthParam]} ${year}`;

            const checks = task.checks || [];

            const doneDays = checks.filter(v => v).length;
            const missedDays = checks.length - doneDays;

            // 🥧 PIE CHART
            new Chart(pieCanvas, {
                type: "pie",
                data: {
                    labels: ["Done", "Missed"],
                    datasets: [{
                        data: [doneDays, missedDays]
                    }]
                },
                options: {
                    plugins: {
                        legend: { position: "bottom" }
                    }
                }
            });

            // 📈 LINE CHART
            new Chart(lineCanvas, {
                type: "line",
                data: {
                    labels: checks.map((_, i) => i + 1),
                    datasets: [{
                        label: "Completed",
                        data: checks.map(v => v ? 1 : 0),
                        tension: 0.3
                    }]
                },
                options: {
                    scales: {
                        y: {
                            min: 0,
                            max: 1,
                            ticks: {
                                stepSize: 1,
                                callback: function (value) {
                                    if (value === 1) return "Done";
                                    if (value === 0) return "Missed";
                                    return "";
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        })
        .catch(err => console.error("Task report error:", err));

})();

// ================= LOGIN HANDLER =================
if (window.location.pathname.includes("login.html")) {

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            try {
                const res = await fetch(`$https://streakflow-backend-uagq.onrender.com/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || "Login failed");
                    return;
                }

                localStorage.setItem("streakflow_token", data.token);
                window.location.href = "dashboard.html";

            } catch (error) {
                console.error(error);
                alert("Something went wrong");
            }
        });
    }
}

// ================= SIGNUP HANDLER =================
if (window.location.pathname.includes("signup.html")) {

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
            const confirmPassword =
                document.getElementById("signupConfirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            try {
                const res = await fetch(`$https://streakflow-backend-uagq.onrender.com/api/auth/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || "Signup failed");
                    return;
                }

                alert("Signup successful! Please login.");
                window.location.href = "login.html";

            } catch (error) {
                console.error(error);
                alert("Something went wrong");
            }
        });
    }
}

// Run auth check on protected pages
if (
    window.location.pathname.includes("dashboard.html") ||
    window.location.pathname.includes("report.html") ||
    window.location.pathname.includes("report-view.html") ||
    window.location.pathname.includes("task-report.html")
) {
    requireAuth();
}
// ================= FETCH TASKS FROM BACKEND =================

async function fetchTasksFromBackend() {
    try {
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const res = await fetch(
            `https://streakflow-backend-uagq.onrender.com/api/tasks?month=${month}&year=${year}`,
            {
                headers: getAuthHeaders()
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch tasks");
            return;
        }

        const tasks = await res.json();
        console.log("Tasks from backend:", tasks);

        renderTasksFromBackend(tasks);

    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}
function renderTasksFromBackend(tasks) {
    const taskBody = document.getElementById("taskBody");
    if (!taskBody) return;

    taskBody.innerHTML = "";
    const month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    tasks.forEach(task => {
        const tr = document.createElement("tr");

        // Task name
        const nameTd = document.createElement("td");
        nameTd.className = "task-name";
        nameTd.textContent = task.name;
        tr.appendChild(nameTd);

        // Ensure correct length
        const checks = task.checks.length === daysInMonth
            ? task.checks
            : Array(daysInMonth).fill(false);

        checks.forEach((done, index) => {
            const td = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = done;

            // 🔥 SAVE ON CHANGE
            checkbox.addEventListener("change", async () => {
                checks[index] = checkbox.checked;

                try {
                    await fetch(
                        `https://streakflow-backend-uagq.onrender.com/api/tasks/${task._id}`,
                        {
                            method: "PATCH",
                            headers: getAuthHeaders(),
                            body: JSON.stringify({ checks })
                        }
                    );
                } catch (error) {
                    console.error("Failed to update task", error);
                }
            });

            td.appendChild(checkbox);
            tr.appendChild(td);
        });

        taskBody.appendChild(tr);
    });
}


// Load tasks when dashboard opens
if (window.location.pathname.includes("dashboard.html")) {
    fetchTasksFromBackend();
}
// ================= ADD DAILY TASK (BACKEND) =================

const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");

if (addTaskBtn && taskInput) {

    addTaskBtn.addEventListener("click", async () => {
        const taskName = taskInput.value.trim();
        if (!taskName) return;

        try {
            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            await fetch(`$https://streakflow-backend-uagq.onrender.com/api/tasks`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: taskName,
                    checks: [],
                    month,
                    year
                })
            });

            taskInput.value = "";

            // Reload tasks from backend
            fetchTasksFromBackend();

        } catch (error) {
            console.error("Error adding task:", error);
        }
    });
}
// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("streakflow_token");
        window.location.href = "login.html";
    });
