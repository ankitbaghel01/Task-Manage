import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Loader2, CheckCircle2, Calendar, Clock, Star } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/tasks/');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        await fetchTasks();
        setNewTask({ title: '', description: '' });
        setIsAddingTask(false);
        showSuccessMessage('Task added successfully!');
      }
    } catch (err) {
      setError('Failed to add task');
    }
  };

  // Update task
  const handleUpdateTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask),
      });
      if (response.ok) {
        await fetchTasks();
        setEditingTask(null);
        showSuccessMessage('Task updated successfully!');
      }
    } catch (err) {
      setError('Failed to update task');
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchTasks();
        showSuccessMessage('Task deleted successfully!');
      }
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-pink-100 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Task Master
              </h1>
              <p className="text-gray-600">Organize your tasks with style</p>
            </div>
            <button
              onClick={() => setIsAddingTask(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <Plus size={24} className="transform group-hover:rotate-180 transition-transform duration-500" />
                Create Task
              </span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-4 mb-8 flex gap-4 overflow-x-auto">
          {['all', 'recent', 'important'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                selectedFilter === filter
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideInRight">
            <CheckCircle2 size={24} />
            {successMessage}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-2xl mb-8 relative animate-shake">
            {error}
            <button
              onClick={() => setError(null)}
              className="absolute top-4 right-4 hover:bg-red-100 rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Add Task Form */}
        {isAddingTask && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 animate-slideInUp">
            <form onSubmit={handleAddTask} className="space-y-6">
              <div>
                <label className="text-gray-700 font-medium mb-2 block">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium mb-2 block">Task Description</label>
                <textarea
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  rows="4"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-4 rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Check size={24} /> Save Task
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-4 rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <X size={24} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full h-64 flex justify-center items-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600">
                  <Loader2 size={24} className="animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="group bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20"
              >
                {editingTask && editingTask._id === task._id ? (
                  <div className="space-y-4 animate-fadeIn">
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, title: e.target.value })
                      }
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <textarea
                      value={editingTask.description}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, description: e.target.value })
                      }
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      rows="4"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleUpdateTask(task._id)}
                        className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Check size={20} /> Save
                      </button>
                      <button
                        onClick={() => setEditingTask(null)}
                        className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <X size={20} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                        {task.title}
                      </h2>
                      <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                        <Star size={20} />
                      </button>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Created today</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>No due date</span>
                      </div>
                    </div>
                    <div className="pt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                      >
                        <Pencil size={20} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-500 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                      >
                        <Trash2 size={20} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;