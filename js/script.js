
/* =========================================
   1. FOOTER YEAR
========================================= */

document.querySelectorAll(".year").forEach((element) => {
    element.textContent = new Date().getFullYear();
});


/* =========================================
   2. MOBILE NAVIGATION
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {

    function closeMenu() {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    // Close the menu after selecting a page.
    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Close the menu when the Escape key is pressed.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
        const clickedInsideMenu = mainNav.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMenu();
        }
    });

    // Close mobile menu if the browser is resized to desktop width.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            closeMenu();
        }
    });
}


/* =========================================
   3. ACADEMIC PLANNER
========================================= */

const taskForm = document.getElementById("taskForm");

if (taskForm) {

    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const emptyMessage = document.getElementById("emptyMessage");

    const taskCount = document.getElementById("taskCount");
    const completedCount = document.getElementById("completedCount");
    const remainingCount = document.getElementById("remainingCount");
    const taskSummary = document.getElementById("taskSummary");

    const STORAGE_KEY = "damilare_academic_tasks";

    let tasks = [];

    // Load saved tasks safely.
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);

            if (Array.isArray(parsedTasks)) {
                tasks = parsedTasks.filter((task) =>
                    task &&
                    typeof task.id === "string" &&
                    typeof task.text === "string" &&
                    typeof task.completed === "boolean"
                );
            }
        }
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        tasks = [];
    }

    // Save tasks to the browser.
    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error("Could not save tasks:", error);
            alert("Your browser could not save the tasks. Check your browser storage settings.");
        }
    }

    // Update the planner statistics.
    function updateStatistics() {
        const total = tasks.length;

        const completed = tasks.filter(
            (task) => task.completed
        ).length;

        const remaining = total - completed;

        if (taskCount) {
            taskCount.textContent = total;
        }

        if (completedCount) {
            completedCount.textContent = completed;
        }

        if (remainingCount) {
            remainingCount.textContent = remaining;
        }

        if (taskSummary) {
            taskSummary.textContent =
                total === 1 ? "1 task" : `${total} tasks`;
        }

        if (emptyMessage) {
            emptyMessage.hidden = total > 0;
        }
    }

    // Display all tasks.
    function renderTasks() {

        taskList.replaceChildren();

        tasks.forEach((task) => {

            const listItem = document.createElement("li");
            listItem.className = "task-item";

            if (task.completed) {
                listItem.classList.add("completed");
            }

            const leftContainer = document.createElement("div");
            leftContainer.className = "task-item-left";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute(
                "aria-label",
                `Mark ${task.text} as completed`
            );

            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;

                saveTasks();
                renderTasks();
            });

            const taskText = document.createElement("span");
            taskText.textContent = task.text;

            leftContainer.appendChild(checkbox);
            leftContainer.appendChild(taskText);

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-task";
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute(
                "aria-label",
                `Delete task: ${task.text}`
            );

            deleteButton.addEventListener("click", () => {

                tasks = tasks.filter(
                    (item) => item.id !== task.id
                );

                saveTasks();
                renderTasks();
            });

            listItem.appendChild(leftContainer);
            listItem.appendChild(deleteButton);

            taskList.appendChild(listItem);
        });

        updateStatistics();
    }

    // Add a new task.
    taskForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const taskText = taskInput.value.trim();

        if (!taskText) {
            taskInput.focus();
            return;
        }

        const newTask = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            text: taskText,
            completed: false
        };

        tasks.push(newTask);

        saveTasks();
        renderTasks();

        taskForm.reset();
        taskInput.focus();
    });

    // Display saved tasks when the page opens.
    renderTasks();
}


/* =========================================
   4. CONTACT FORM
========================================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        // Make sure all fields contain information.
        if (!name || !email || !subject || !message) {
            alert("Please complete all the fields.");
            return;
        }

        // Validate the email address.
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

            Regards,
            ${name}

            Sender email: ${email}`
        );

        const mailtoLink =
            `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

        // Open the visitor's default email application.
        window.location.href = mailtoLink;

    });
}


/* =========================================
   5. IMAGE PLACEHOLDER SUPPORT
========================================= */

// Allow placeholder elements to display a real photo
// when a data-image attribute is added to them.

document.querySelectorAll("[data-image]").forEach((element) => {

    const imagePath = element.dataset.image;

    if (!imagePath) return;

    const image = document.createElement("img");

    image.src = imagePath;
    image.alt = element.dataset.alt || "Portfolio photograph";

    image.addEventListener("error", () => {
        console.error("Could not load image:", imagePath);
    });

    element.replaceChildren(image);
});
