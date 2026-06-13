// Analytics & Charts Module
const ChartsApp = (() => {
    let tasksChart = null;
    let timeChart = null;

    const getTasksData = () => {
        const todos = TodoApp.getTodos();
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const completedByDay = new Array(7).fill(0);

        todos.forEach(todo => {
            const date = new Date(todo.createdAt);
            const dayOfWeek = (date.getDay() + 6) % 7; // Convert to 0-6 Monday-Sunday
            if (todo.completed) {
                completedByDay[dayOfWeek]++;
            }
        });

        return {
            labels: days,
            datasets: [{
                label: 'Tasks Completed',
                data: completedByDay,
                backgroundColor: '#6c63ff',
                borderColor: '#5a52d5',
                borderWidth: 2
            }]
        };
    };

    const getCategoryData = () => {
        const todos = TodoApp.getTodos();
        const categories = {};

        todos.forEach(todo => {
            if (categories[todo.category]) {
                categories[todo.category]++;
            } else {
                categories[todo.category] = 1;
            }
        });

        const labels = Object.keys(categories);
        const data = Object.values(categories);
        const colors = ['#6c63ff', '#ff6584', '#2ecc71', '#f39c12'];

        return {
            labels,
            datasets: [{
                label: 'Tasks by Category',
                data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#fff',
                borderWidth: 2
            }]
        };
    };

    const initTasksChart = () => {
        const ctx = document.getElementById('tasksChart').getContext('2d');
        
        if (tasksChart) {
            tasksChart.destroy();
        }

        tasksChart = new Chart(ctx, {
            type: 'bar',
            data: getTasksData(),
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    };

    const initTimeChart = () => {
        const ctx = document.getElementById('timeChart').getContext('2d');
        
        if (timeChart) {
            timeChart.destroy();
        }

        timeChart = new Chart(ctx, {
            type: 'doughnut',
            data: getCategoryData(),
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    };

    const displayStats = () => {
        const todos = TodoApp.getTodos();
        const completedCount = TodoApp.getCompletedCount();
        const totalCount = TodoApp.getTotalCount();
        const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        const stats = [
            { label: 'Total Tasks', value: totalCount },
            { label: 'Completed', value: completedCount },
            { label: 'Completion Rate', value: completionRate + '%' },
            { label: 'Remaining', value: totalCount - completedCount }
        ];

        const statsDisplay = document.getElementById('statsDisplay');
        statsDisplay.innerHTML = stats.map(stat => `
            <div class="stat-item">
                <div class="stat-label">${stat.label}</div>
                <div class="stat-value">${stat.value}</div>
            </div>
        `).join('');
    };

    const setupEventListeners = () => {
        // Listen for changes in todos
        document.addEventListener('todoUpdated', () => {
            initTasksChart();
            initTimeChart();
            displayStats();
        });
    };

    return {
        init: () => {
            initTasksChart();
            initTimeChart();
            displayStats();
            setupEventListeners();
        },
        refresh: () => {
            initTasksChart();
            initTimeChart();
            displayStats();
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    ChartsApp.init();
});
