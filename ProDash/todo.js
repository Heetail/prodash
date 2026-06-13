// To-Do List Module
const TodoApp = (() => {
    const todoInput = document.getElementById('todoInput');
    const todoCategory = document.getElementById('todoCategory');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let todos = DB.get('todos', []);
    let currentFilter = 'all';

    const saveTodos = () => {
        DB.set('todos', todos);
    };

    const addTodo = (text, category = 'work') => {
        if (!text.trim()) return;
        
        const todo = {
            id: Date.now(),
            text,
            category,
            completed: false,
            createdAt: new Date().toISOString()
        };
        todos.unshift(todo);
        saveTodos();
        render();
        todoInput.value = '';
    };

    const toggleTodo = (id) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            saveTodos();
            render();
        }
    };

    const deleteTodo = (id) => {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        render();
    };

    const getFilteredTodos = () => {
        switch (currentFilter) {
            case 'active':
                return todos.filter(t => !t.completed);
            case 'completed':
                return todos.filter(t => t.completed);
            default:
                return todos;
        }
    };

    const render = () => {
        const filtered = getFilteredTodos();
        todoList.innerHTML = filtered.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input type="checkbox" class="todo-check" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                <span class="todo-text">${todo.text}</span>
                <span class="todo-category">${todo.category}</span>
                <div class="todo-actions">
                    <button class="todo-delete" data-id="${todo.id}">Delete</button>
                </div>
            </li>
        `).join('');

        // Event listeners
        document.querySelectorAll('.todo-check').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => toggleTodo(parseInt(e.target.dataset.id)));
        });

        document.querySelectorAll('.todo-delete').forEach(btn => {
            btn.addEventListener('click', (e) => deleteTodo(parseInt(e.target.dataset.id)));
        });
    };

    const setupEventListeners = () => {
        addTodoBtn.addEventListener('click', () => {
            addTodo(todoInput.value, todoCategory.value);
        });

        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo(todoInput.value, todoCategory.value);
        });

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                render();
            });
        });
    };

    return {
        init: () => {
            setupEventListeners();
            render();
        },
        getTodos: () => todos,
        getCompletedCount: () => todos.filter(t => t.completed).length,
        getTotalCount: () => todos.length
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    TodoApp.init();
});
