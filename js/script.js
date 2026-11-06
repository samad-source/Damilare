document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // CURRENT YEAR IN FOOTER
    // =====================================

    document.querySelectorAll('.year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });


    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (toggle && nav) {

        toggle.addEventListener('click', () => {

            const isOpen = nav.classList.toggle('open');

            toggle.setAttribute(
                'aria-expanded',
                String(isOpen)
            );

        });

        nav.querySelectorAll('a').forEach(link => {

            link.addEventListener('click', () => {

                nav.classList.remove('open');

                toggle.setAttribute(
                    'aria-expanded',
                    'false'
                );

            });

        });

    }


    // =====================================
    // CONTACT FORM
    // =====================================

    const form = document.getElementById('contactForm');

    if (form) {

        form.addEventListener('submit', event => {

            event.preventDefault();

            if (!form.reportValidity()) return;

            const data = new FormData(form);

            const subject = encodeURIComponent(
                data.get('subject')
            );

            const body = encodeURIComponent(
                `Name: ${data.get('name')}
Email: ${data.get('email')}

${data.get('message')}`
            );

            window.location.href =
                `mailto:damilareakinlami@gmail.com?subject=${subject}&body=${body}`;

        });

    }


    // =====================================
    // ACADEMIC PLANNER
    // =====================================

    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');


    // Add a task to the list

    function addTask() {

        const taskText = taskInput.value.trim();

        // Prevent empty tasks

        if (taskText === '') {

            taskInput.focus();

            return;

        }


        // Create task container

        const li = document.createElement('li');

        li.classList.add('task-item');


        // Create checkbox

        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';

        checkbox.setAttribute(
            'aria-label',
            `Mark ${taskText} as completed`
        );


        // Create task text

        const span = document.createElement('span');

        span.textContent = taskText;


        // Mark task as completed

        checkbox.addEventListener('change', () => {

            li.classList.toggle(
                'completed',
                checkbox.checked
            );

        });


        // Create delete button

        const deleteButton = document.createElement('button');

        deleteButton.type = 'button';

        deleteButton.textContent = 'Delete';

        deleteButton.classList.add('delete-task');

        deleteButton.setAttribute(
            'aria-label',
            `Delete task: ${taskText}`
        );


        // Delete task

        deleteButton.addEventListener('click', () => {

            li.remove();

        });


        // Add elements to task container

        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(deleteButton);


        // Display task

        taskList.appendChild(li);


        // Clear input

        taskInput.value = '';

        taskInput.focus();

    }


    // Make addTask available to the original
    // inline onclick="addTask()" button.

    window.addTask = addTask;


    // Support a form-based planner as well.

    if (taskForm) {

        taskForm.addEventListener('submit', event => {

            event.preventDefault();

            addTask();

        });

    }


});