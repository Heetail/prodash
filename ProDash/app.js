// Main App Controller
const App = (() => {
    const setupNavigation = () => {
        const navLinks = document.querySelectorAll('.nav-link[data-module]');
        const sections = document.querySelectorAll('.module-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = link.dataset.module;

                // Remove active class from all
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                // Add active to selected
                link.classList.add('active');
                document.getElementById(module).classList.add('active');

                // Refresh charts if navigating to analytics
                if (module === 'charts') {
                    setTimeout(() => ChartsApp.refresh(), 100);
                }
            });
        });
    };

    const updateDashboard = () => {
        // Update stats
        const todos = TodoApp.getTodos();
        const completed = TodoApp.getCompletedCount();
        const total = TodoApp.getTotalCount();

        const statsHTML = `
            <p><strong>Total Tasks:</strong> ${total}</p>
            <p><strong>Completed:</strong> ${completed}</p>
            <p><strong>Pending:</strong> ${total - completed}</p>
            <p><strong>Completion Rate:</strong> ${total > 0 ? Math.round((completed / total) * 100) : 0}%</p>
        `;
        document.getElementById('dashboardStats').innerHTML = statsHTML;

        // Update today's todos
        const todayTodos = todos.filter(t => {
            const date = new Date(t.createdAt);
            const today = new Date();
            return date.toDateString() === today.toDateString();
        }).slice(0, 5);

        const todosHTML = todayTodos.length > 0 
            ? todayTodos.map(t => `<p>✓ ${t.text}</p>`).join('')
            : '<p>No tasks for today</p>';
        document.getElementById('dashboardTodos').innerHTML = todosHTML;

        // Update timer info
        const timerHTML = '<p>⏱️ Timer ready to use</p>';
        document.getElementById('dashboardTimer').innerHTML = timerHTML;
    };

    const setupEventDelegation = () => {
        // Dispatch custom event when todos change
        const observeTodos = setInterval(() => {
            document.dispatchEvent(new CustomEvent('todoUpdated'));
        }, 1000);
    };

    const init = () => {
        setupNavigation();
        updateDashboard();
        setupEventDelegation();

        // Update dashboard every 30 seconds
        setInterval(updateDashboard, 30000);
    };

    return {
        init
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Prevent accidental data loss on navigation
window.addEventListener('beforeunload', (e) => {
    const todos = TodoApp.getTodos();
    if (todos.length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});
