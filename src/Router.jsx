import { Navigate, Route, Routes } from 'react-router-dom';

// Pages
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Register from './pages/Register';

function PrivateRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/" replace />;
}

function Router({ onLogin, onRegister, onCreateTask, onLoadTasks, onToggleTask, onLogout, userProfile, userTasks, isAuthenticated }) {
  return (
    <Routes>
      <Route path="/tasks" element={
        <PrivateRoute isAuthenticated={isAuthenticated}>
            <Tasks userProfile={userProfile} userTasks={userTasks} onCreateTask={onCreateTask} onLoadTasks={onLoadTasks} onToggleTask={onToggleTask} onLogout={onLogout} />
          </PrivateRoute>
      } />
      <Route path="/" element={ isAuthenticated ? <Navigate to="/tasks" /> : <Login onLogin={onLogin} />} />
      <Route path="/register" element={<Register onRegister={onRegister} />} />
      <Route path="*" element={ isAuthenticated ? <Navigate to="/tasks" /> : <Navigate to="/" replace />} />
    </Routes>
  );
}

export default Router;