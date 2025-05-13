const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //middleware

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); //conttent type, gets the value form the form


let todos = [];


let idCounter = 0;
app.post('/add', (req, res) => {
    const todo = req.body.todo;
    if (todo) {
        todos.push({ id: idCounter++, text: todo, completed: false });
    }
    res.redirect('/');
})

app.post('/toggle/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(i => i.id === id);
    if (todo) {
        todo.completed = !todo.completed; //toggles the completed status
    }
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    const filter = req.query.filter || 'all';
    let filteredTodos = todos;

    if (filter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    const itemsLeft = todos.filter(todo => !todo.completed).length;
    // console.log('itemsLeft:', itemsLeft)

    res.render('index', {
        todos: filteredTodos,
        filter,
        itemsLeft
    });
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