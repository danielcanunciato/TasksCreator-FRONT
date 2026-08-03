import { useEffect, useState } from 'react';

import './index.css';

import TaskMemo from '../../components/TasksMemo';

export default function Tasks({ userProfile, userTasks, onCreateTask, onLoadTasks, onToggleTask, onLogout }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    setTasks(userTasks || []);
  }, [userTasks]);

  useEffect(() => {
    setFilter(selectedFilter);
  }, [tasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      setFilter(selectedFilter);
    }
  }, [tasks.length]);

  useEffect(() => {
    if (onLoadTasks) {
      onLoadTasks();
    }
  }, []);

  const handleCompletion = async (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    const result = await onToggleTask(taskId, !task.completed);
    if (!result?.success) {
      alert(`Error: ${result?.error}`);
    }
  };

  const handleNewTask = async () => {
    if (!taskTitle || !taskDesc) return;

    const result = await onCreateTask({ title: taskTitle, desc: taskDesc, completed: false });
    if (result?.success) {
      setTaskTitle('');
      setTaskDesc('');
    } else {
      alert(`Error: ${result?.error}`);
    }
  };

  const setFilter = (filter) => {
    setSelectedFilter(filter);

    if (filter === 'all') {
      setFiltered(tasks);
    } else if (filter === 'completed') {
      setFiltered(tasks.filter((task) => task.completed));
    } else if (filter === 'pending') {
      setFiltered(tasks.filter((task) => !task.completed));
    }
  };

  return (
    <div className="auth-animation">
      <div>
        <h2>Tasks</h2>
        <p>Create, edit and delete your tasks</p>
        <div>
            <p>Logged in as <b>{userProfile?.username}</b></p>
            <button onClick={onLogout} style={{marginTop: "15px", marginBottom: "15px"}} className='filter-button filter-pending'>Log off</button>
        </div>
      </div>

      <form
        className="task-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleNewTask();
        }}
      >
        <input
          maxLength={15}
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task Title"
          required
        />

        <input
          maxLength={30}
          type="text"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
          placeholder="Task Description"
          required
        />

        <button type="submit">Add Task</button>
      </form>

      <div className="tasks-filter">
        <button onClick={() => setFilter('all')} className={`filter-button filter-all ${selectedFilter === 'all' ? 'filter-active' : ''}`}>
          All
        </button>
        <button onClick={() => setFilter('completed')} className={`filter-button filter-completed ${selectedFilter === 'completed' ? 'filter-active' : ''}`}>
          Completed
        </button>
        <button onClick={() => setFilter('pending')} className={`filter-button filter-pending ${selectedFilter === 'pending' ? 'filter-active' : ''}`}>
          Pending
        </button>
      </div>

      <table className="tasks-container">
        <thead>
          <tr>
            <th>ID</th>
            <th>TITLE</th>
            <th>DESCRIPTION</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length > 0 && filtered.map((task) => <TaskMemo key={task.id} content={task} onCompletion={handleCompletion} />)}
        </tbody>
      </table>
    </div>
  );
}