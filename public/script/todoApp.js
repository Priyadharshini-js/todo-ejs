
// On page load, show/hide clear button and update items left
document.addEventListener('DOMContentLoaded', () => {

    const input = document.querySelector('input[name="todo"]');
    input.focus();

    updateClearCompletedVisibility();
});

// function to update clear completed button visibility
function updateClearCompletedVisibility() {
    const anyCompleted = [...document.querySelectorAll('.toggle')].some(cb => cb.checked);
    const ClearCompletedButton = document.querySelector('.clear-completed');
    ClearCompletedButton.style.visibility = anyCompleted ? 'visible' : 'hidden';
}


//toggle checkbox
document.querySelectorAll('.toggle').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const id = this.dataset.id;
        const ClearCompletedButton = document.querySelector('.clear-completed');
        ClearCompletedButton.style.visibility = 'hidden';

        fetch(`/toggle/${id}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                const todoCountSpan = document.querySelector('.todo-count');
                todoCountSpan.textContent = `${data.itemsLeft} item${data.itemsLeft !== 1 ? 's' : ''} left`;

                updateClearCompletedVisibility();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});

//add todo
document.getElementById('todo-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const todoText = this.value.trim();
        const filter = this.dataset.filter;

        if (todoText === '') return;

        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                todo: todoText,
                filter: filter
            })
        })
            .then(res => {
                if (res.redirected) {
                    window.location.href = res.url;
                } else {
                    alert('Failed to add todo.');
                }
            })
            .catch(err => console.error('Error while adding todo:', err));
    }
});

//delete single todo
document.querySelectorAll('.close-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.dataset.id;

        fetch(`/delete/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    location.reload();
                } else {
                    alert('Failed to delete todo.');
                }
            })
            .catch(error => {
                console.error('Error while deleting todo:', error);
            });
    });
});

// Clear completed todos
document.querySelector('.clear-completed').addEventListener('click', function () {
    fetch('/clear-completed', {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                location.reload();
            } else {
                alert('Failed to clear completed todos.');
            }
        })
        .catch(error => {
            console.error('Error while clearing completed todos:', error);
        });
});