const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use('/templates', express.static(path.join(__dirname, 'public', 'templates')));  // Serve templates from the templates folder inside public
app.use(express.json()); //conttent type, gets the value form the form

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


let todos = [];
let idCounter = 0;

app.post('/add', (req, res) => {
    const todo = req.body.todo;
    if (todo) {
        todos.push({ id: idCounter++, text: todo, completed: false });
    }
    res.json({ success: true });
})

app.post('/toggle/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(i => i.id === id);
    if (todo) {
        todo.completed = !todo.completed; //toggles the completed status
    }
    const itemsLeft = todos.filter(todo => !todo.completed).length;
    res.json({ itemsLeft });
});

app.get('/todos', (req, res) => {
    const filter = req.query.filter || 'all';
    let filteredTodos = todos;

    if (filter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    const itemsLeft = todos.filter(todo => !todo.completed).length;

    res.json({ todos: filteredTodos, filter, itemsLeft, allTodos: todos });
});


app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(todo => todo.id !== id);
    res.sendStatus(200);
})

app.delete('/clear-completed', (req, res) => {
    todos = todos.filter(todo => !todo.completed);
    res.sendStatus(200);
});


app.listen(3000, () => {
    console.log('server is running on port 3000')
})