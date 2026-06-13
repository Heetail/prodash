// Database Module - Local Storage Management
const DB = (() => {
    const prefix = 'prodash_';

    return {
        set: (key, value) => {
            localStorage.setItem(prefix + key, JSON.stringify(value));
        },
        get: (key, defaultValue = null) => {
            const item = localStorage.getItem(prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        },
        remove: (key) => {
            localStorage.removeItem(prefix + key);
        },
        clear: () => {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(prefix)) {
                    localStorage.removeItem(key);
                }
            });
        },
        getAll: () => {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(prefix)) {
                    data[key.substring(prefix.length)] = JSON.parse(localStorage.getItem(key));
                }
            }
            return data;
        }
    };
})();

// Auth Module
const Auth = (() => {
    const currentUser = DB.get('currentUser', null);

    return {
        register: (name, email, password) => {
            const users = DB.get('users', {});
            if (users[email]) {
                return { success: false, message: 'Email already registered' };
            }
            users[email] = {
                name,
                email,
                password: btoa(password),
                createdAt: new Date().toISOString()
            };
            DB.set('users', users);
            return { success: true, message: 'Registration successful!' };
        },

        login: (email, password) => {
            const users = DB.get('users', {});
            const user = users[email];
            if (!user || user.password !== btoa(password)) {
                return { success: false, message: 'Invalid email or password' };
            }
            DB.set('currentUser', { email, name: user.name });
            window.location.reload();
            return { success: true, message: 'Login successful!' };
        },

        logout: () => {
            DB.remove('currentUser');
            window.location.reload();
        },

        isLoggedIn: () => {
            return DB.get('currentUser') !== null;
        },

        getCurrentUser: () => {
            return DB.get('currentUser');
        }
    };
})();
