// Authentication UI Handler
const AuthUI = (() => {
    const modal = document.getElementById('authModal');
    const authBtn = document.getElementById('authBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const userInfo = document.getElementById('userInfo');
    const modalClose = document.querySelector('.modal-close');

    const setupEventListeners = () => {
        // Auth button
        authBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (Auth.isLoggedIn()) {
                Auth.logout();
            } else {
                modal.classList.add('active');
            }
        });

        // Modal close
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Tab switching
        document.querySelectorAll('.auth-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(tab + 'Form').classList.add('active');
            });
        });

        // Login
        document.getElementById('loginBtn').addEventListener('click', () => {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            if (email && password) {
                const result = Auth.login(email, password);
                if (!result.success) alert(result.message);
            }
        });

        // Register
        document.getElementById('registerBtn').addEventListener('click', () => {
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirm = document.getElementById('registerConfirm').value;
            
            if (!name || !email || !password || !confirm) {
                alert('Please fill all fields');
                return;
            }
            if (password !== confirm) {
                alert('Passwords do not match');
                return;
            }
            const result = Auth.register(name, email, password);
            alert(result.message);
            if (result.success) {
                document.querySelectorAll('.auth-tab-btn')[0].click();
            }
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            Auth.logout();
        });
    };

    const updateUI = () => {
        if (Auth.isLoggedIn()) {
            const user = Auth.getCurrentUser();
            document.getElementById('userName').textContent = user.name;
            authBtn.textContent = 'Logout';
            loginForm.classList.remove('active');
            registerForm.classList.remove('active');
            userInfo.style.display = 'block';
        } else {
            authBtn.textContent = 'Login';
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            userInfo.style.display = 'none';
        }
    };

    return {
        init: () => {
            setupEventListeners();
            updateUI();
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    AuthUI.init();
});
