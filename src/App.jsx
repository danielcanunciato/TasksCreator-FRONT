import { useEffect, useState } from 'react';

import Router from './Router.jsx';

function App() {
  //const API_BASE = 'http://localhost:4000';
  const API_BASE = "https://tc-api.clooverlandstudios.com";

  const [authToken, setAuthToken] = useState(() => {
    if (localStorage.getItem('userSignedOut') === 'true') return null;
    return localStorage.getItem('authToken') || null;
  });
  const [userTasks, setUserTasks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [authUser, setAuthUser] = useState(() => {
    if (localStorage.getItem('userSignedOut') === 'true') return null;
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = Boolean(authUser && authToken);

  const getActiveToken = () => authToken || localStorage.getItem('authToken') || null;

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      localStorage.removeItem('userSignedOut');
    } else {
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('authUser', JSON.stringify(authUser));
      localStorage.removeItem('userSignedOut');
    } else {
      localStorage.removeItem('authUser');
    }
  }, [authUser]);

  useEffect(() => {
    const restoreSession = async () => {
      if (!authToken || !authUser) return;

      try {
        const tasks = await fetchJson('/tasks');
        setUserTasks(tasks || []);
        setUserProfile(authUser);
      } catch (err) {
        console.error('Failed to restore session', err);
        setAuthUser(null);
        setAuthToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        localStorage.setItem('userSignedOut', 'true');
      }
    };

    restoreSession();
  }, [authToken, authUser]);

  const fetchJson = async (path, options = {}) => {
    const activeToken = getActiveToken();

    if (!activeToken && !['/login', '/register'].includes(path)) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        ...options.headers,
      },
      ...options,
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.error || body.message || response.statusText);
    }
    return body;
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const body = await fetchJson('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      const nextToken = body.token;

      localStorage.setItem('authToken', nextToken);
      localStorage.setItem('authUser', JSON.stringify(body.user));
      localStorage.removeItem('userSignedOut');

      setAuthUser(body.user);
      setAuthToken(nextToken);
      setUserProfile(body.user);
      setUserTasks(body.userTasks || []);

      return { success: true, user: body.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleRegister = async ({ username, password }) => {
    try {
      const body = await fetchJson('/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      return { success: true, message: body.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthToken(null);
    setUserProfile(null);
    setUserTasks([]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.setItem('userSignedOut', 'true');
  };

  const handleCreateTask = async ({ title, desc, completed }) => {
    try {
      const body = await fetchJson('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, desc, completed }),
      });

      const newTask = {
        id: body.id,
        title,
        desc,
        completed,
      };

      setUserTasks((prev) => [newTask, ...prev]);
      return { success: true, task: newTask };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleLoadTasks = async () => {
    try {
      const tasks = await fetchJson('/tasks');
      setUserTasks(tasks || []);
      return { success: true, tasks };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      const body = await fetchJson(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      });

      setUserTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: body.completed } : task)));
      return { success: true, task: body };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <>
      <Router
        onLogin={handleLogin}
        onRegister={handleRegister}
        onCreateTask={handleCreateTask}
        onLoadTasks={handleLoadTasks}
        onToggleTask={handleToggleTask}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        userProfile={userProfile}
        userTasks={userTasks}
      />
    </>
  );
}

export default App