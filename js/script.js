
/* =========================================
   AKINLAMI DAMILARE MOSES — PORTFOLIO
   Main JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. MOBILE NAVIGATION
    ===================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        // Close menu after clicking a navigation link
        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            });
        });

        // Close menu when clicking outside it
        document.addEventListener("click", event => {
            const clickedInsideNav = mainNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedToggle) {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            }
        });

        // Close menu with Escape key
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            }
        });

        // Reset mobile menu when returning to desktop layout
        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            }
        });
    }


    /* =====================================
       2. AUTOMATIC FOOTER YEAR
    ===================================== */

    document.querySelectorAll(".year").forEach(element => {
        element.textContent = new Date().getFullYear();
    });


    /* =====================================
       3. PERSONAL TASK PLANNER
    ===================================== */

    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    const taskCount = document.getElementById("taskCount");
    const completedCount = document.getElementById("completedCount");
    const remainingCount = document.getElementById("remainingCount");

    const emptyMessage = document.getElementById("emptyMessage");
    const taskSummary = document.getElementById("taskSummary");

    const STORAGE_KEY = "akinlamiPortfolioTasks";

    let tasks = [];

    // Load previously saved tasks safely
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);

            if (Array.isArray(parsedTasks)) {
                tasks = parsedTasks.filter(task =>
                    task &&
                    typeof task.id === "string" &&
                    typeof task.text === "string" &&
                    typeof task.completed === "boolean"
                );
            }
        }
    } catch (error) {
        console.error("Unable to load saved tasks:", error);
        tasks = [];
    }

    // Save tasks to browser storage
    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error("Unable to save tasks:", error);

            if (taskSummary) {
                taskSummary.textContent =
                    "Your browser could not save the tasks. Check your storage settings.";
            }
        }
    }

    // Update task statistics
    function updateTaskStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const remaining = total - completed;

        if (taskCount) taskCount.textContent = total;
        if (completedCount) completedCount.textContent = completed;
        if (remainingCount) remainingCount.textContent = remaining;

        if (emptyMessage) {
            emptyMessage.style.display = total === 0 ? "block" : "none";
        }

        if (taskSummary) {
            if (total === 0) {
                taskSummary.textContent = "Your task list is currently empty.";
            } else if (remaining === 0) {
                taskSummary.textContent = "Excellent! You have completed all your tasks.";
            } else {
                taskSummary.textContent =
                    `You have ${remaining} task${remaining === 1 ? "" : "s"} remaining.`;
            }
        }
    }

    // Display tasks on the page
    function renderTasks() {

        if (!taskList) return;

        taskList.replaceChildren();

        tasks.forEach(task => {

            const listItem = document.createElement("li");
            listItem.className = "task-item";

            if (task.completed) {
                listItem.classList.add("completed");
            }

            // Task text
            const taskText = document.createElement("span");
            taskText.className = "task-text";
            taskText.textContent = task.text;

            // Task actions
            const actions = document.createElement("div");
            actions.className = "task-actions";

            // Complete button
            const completeButton = document.createElement("button");
            completeButton.type = "button";
            completeButton.className = "task-complete";
            completeButton.textContent = task.completed ? "Undo" : "Complete";
            completeButton.setAttribute(
                "aria-label",
                task.completed
                    ? `Mark ${task.text} as incomplete`
                    : `Mark ${task.text} as complete`
            );

            completeButton.addEventListener("click", () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "task-delete";
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute(
                "aria-label",
                `Delete ${task.text}`
            );

            deleteButton.addEventListener("click", () => {
                tasks = tasks.filter(item => item.id !== task.id);
                saveTasks();
                renderTasks();
            });

            actions.append(completeButton, deleteButton);
            listItem.append(taskText, actions);
            taskList.appendChild(listItem);
        });

        updateTaskStats();
    }

    // Add a new task
    if (taskForm && taskInput && taskList) {

        taskForm.addEventListener("submit", event => {
            event.preventDefault();

            const taskText = taskInput.value.trim();

            if (!taskText) {
                taskInput.focus();
                return;
            }

            const newTask = {
                id: window.crypto?.randomUUID
                    ? window.crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                text: taskText,
                completed: false
            };

            tasks.unshift(newTask);

            saveTasks();
            renderTasks();

            taskForm.reset();
            taskInput.focus();
        });

        // Display saved tasks when the page loads
        renderTasks();
    }


    /* =====================================
       4. CONTACT FORM
    ===================================== */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = document.getElementById("contactName")?.value.trim();
            const email = document.getElementById("contactEmail")?.value.trim();
            const subject = document.getElementById("contactSubject")?.value.trim();
            const message = document.getElementById("contactMessage")?.value.trim();

            if (!name || !email || !subject || !message) {
                alert("Please complete all the fields before continuing.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            const recipient = "damilareakinlami@gmail.com";

            const emailSubject = encodeURIComponent(subject);

            const emailBody = encodeURIComponent(
                `Hello Damilare,

${message}

Best regards,
${name}
${email}`
            );

            const mailtoLink =
                `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

            window.location.href = mailtoLink;
        });
    }

});
