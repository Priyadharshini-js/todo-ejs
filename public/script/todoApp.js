let currentFilter = 'all';

// function to load templates and data
async function loadTemplate(path, data = {}) {
    const res = await fetch(path); // fetch the template(promise resolves the req)
    const templateText = await res.text();
    return ejs.render(templateText, data); //returns the text by actual data, Uses the EJS library to render the template string by injecting the provided data into it.
}

// Render header, todos, and footer
async function renderHeader(filter) {
    const html = await loadTemplate('/templates/header.ejs', { filter });
    document.querySelector('.todo-header').innerHTML = html;
}

async function renderTodoList(todos) {
    const html = await loadTemplate('/templates/todo.ejs', { todos });
    document.querySelector('.todo-list').innerHTML = html;
}

async function renderFooter(itemsLeft, filter, allTodos) {
    const html = await loadTemplate('/templates/footer.ejs', { itemsLeft, filter, allTodos });
    document.querySelector('.todo-footer').innerHTML = html;
}


// function to render the todo lists
function fetchTodos() {
    return fetch(`/todos?filter=${currentFilter}`)
        .then(res => res.json())
        .then(({ todos, itemsLeft, filter, allTodos }) => {
            return Promise.all([
                renderHeader(filter),
                renderTodoList(todos),
                renderFooter(itemsLeft, filter, allTodos)
            ]).then(() => {
                initializeEvents();
            });
        });
}

// function to add todo list
function addTodoList() {
    const input = document.getElementById('todo-input');
    if (!input) return;
    input.focus();

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const todoText = this.value.trim();
            if (!todoText) return;

            const filter = this.dataset.filter || 'all';

            fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ todo: todoText, filter })
            })
                .then(() => fetchTodos())
                .then(() => {
                    this.value = '';
                });
        }
    });
}

//function to toggle the todo list
function toggleTodo(e) {
    const id = e.currentTarget.dataset.id;
    fetch(`/toggle/${id}`, {
        method: 'POST',
    }).then(fetchTodos);
}

//function to delete todo list
function deleteTodo(event) {
    const id = event.currentTarget.dataset.id;

    if (!id) return;

    fetch(`/delete/${id}`, {
        method: 'DELETE',
    }).then(fetchTodos);
}

//function to delete the clear completed todo list
function clearCompletedList() {
    fetch('/clear-completed', {
        method: 'DELETE',
    }).then(fetchTodos);
}

//function to click the toggle button of the singel todo
function attachTodoToggleEvents() {
    document.querySelectorAll('.toggle').forEach(checkbox => {
        checkbox.addEventListener('change', toggleTodo);
    });
}

//function to click the delte button of the singel todo
function attachTodoDeleteEvents() {
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', deleteTodo);
    });
}

//function to click the clear completed btn
function attachClearCompletedEvents() {
    const clearBtn = document.querySelector('.clear-completed');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCompletedList);
    }
}


// Handle tab/filter switching
function attachFilterEvents() {
    document.querySelectorAll('.filters a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            currentFilter = this.dataset.filter;
            fetchTodos();
        });
    });
}


// initializer for all events after rendering
function initializeEvents() {
    addTodoList();
    attachTodoToggleEvents();
    attachTodoDeleteEvents();
    attachClearCompletedEvents();
    attachFilterEvents();
}

// Load everything on DOM ready
document.addEventListener('DOMContentLoaded', fetchTodos);
