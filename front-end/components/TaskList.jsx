'use client';

import { useState, useEffect } from 'react';
import { getTasks } from '@/lib/api';
import TaskItem from './TaskItem';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    
    const handleTaskChange = () => fetchTasks();
    window.addEventListener('task-created', handleTaskChange);
    window.addEventListener('task-updated', handleTaskChange);
    window.addEventListener('task-deleted', handleTaskChange);
    
    return () => {
      window.removeEventListener('task-created', handleTaskChange);
      window.removeEventListener('task-updated', handleTaskChange);
      window.removeEventListener('task-deleted', handleTaskChange);
    };
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-2 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {tasks.length === 0
            ? 'You have no tasks yet. Create one to get started!'
            : `No ${filter !== 'all' ? filter : ''} tasks found.`}
        </div>
      ) : (
        filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))
      )}
    </div>
  );
}