import React, { useState, useEffect } from 'react';
import { storageManager, STORAGE_KEYS } from '../utils/storage';
import { createAgentLog, AGENT_TYPES, AGENT_CONFIG } from '../utils/agents';
import { Plus, Edit3, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedAgent: AGENT_TYPES.DEV,
    status: 'active',
    dueDate: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const savedTasks = storageManager.get(STORAGE_KEYS.TASKS) || [];
    setTasks(savedTasks);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      ...newTask,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const updatedTasks = storageManager.addToArray(STORAGE_KEYS.TASKS, task);
    setTasks(updatedTasks);

    // Log task creation
    const log = createAgentLog(
      newTask.assignedAgent,
      'task_created',
      `Created task: ${newTask.title}`,
      { taskId: task.id, priority: newTask.priority }
    );
    storageManager.addToArray(STORAGE_KEYS.LOGS, log);

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignedAgent: AGENT_TYPES.DEV,
      status: 'active',
      dueDate: ''
    });
    setIsAddingTask(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setNewTask({ ...task });
  };

  const handleUpdateTask = () => {
    if (!newTask.title.trim()) return;

    const updatedTasks = storageManager.updateInArray(STORAGE_KEYS.TASKS, editingTask, newTask);
    setTasks(updatedTasks);

    // Log task update
    const log = createAgentLog(
      newTask.assignedAgent,
      'task_updated',
      `Updated task: ${newTask.title}`,
      { taskId: editingTask }
    );
    storageManager.addToArray(STORAGE_KEYS.LOGS, log);

    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignedAgent: AGENT_TYPES.DEV,
      status: 'active',
      dueDate: ''
    });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = storageManager.removeFromArray(STORAGE_KEYS.TASKS, taskId);
      setTasks(updatedTasks);

      // Log task deletion
      const log = createAgentLog(
        AGENT_TYPES.MANAGER,
        'task_deleted',
        'Task deleted',
        { taskId }
      );
      storageManager.addToArray(STORAGE_KEYS.LOGS, log);
    }
  };

  const handleCompleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const updatedTasks = storageManager.updateInArray(STORAGE_KEYS.TASKS, taskId, {
      status: task.status === 'completed' ? 'active' : 'completed',
      completedAt: task.status === 'completed' ? null : new Date().toISOString()
    });
    setTasks(updatedTasks);

    // Log task completion
    const log = createAgentLog(
      task.assignedAgent,
      task.status === 'completed' ? 'task_reopened' : 'task_completed',
      `${task.status === 'completed' ? 'Reopened' : 'Completed'} task: ${task.title}`,
      { taskId }
    );
    storageManager.addToArray(STORAGE_KEYS.LOGS, log);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      default: return AlertCircle;
    }
  };

  const TaskForm = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Agent</label>
          <select
            value={newTask.assignedAgent}
            onChange={(e) => setNewTask({ ...newTask, assignedAgent: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {Object.entries(AGENT_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter task description"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={editingTask ? handleUpdateTask : handleAddTask}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        <button
          onClick={() => {
            setIsAddingTask(false);
            setEditingTask(null);
            setNewTask({
              title: '',
              description: '',
              priority: 'medium',
              assignedAgent: AGENT_TYPES.DEV,
              status: 'active',
              dueDate: ''
            });
          }}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {(isAddingTask || editingTask) && <TaskForm />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const StatusIcon = getStatusIcon(task.status);
          const agentConfig = AGENT_CONFIG[task.assignedAgent];
          
          return (
            <div key={task.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className={`p-1 rounded hover:bg-gray-100 ${task.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 rounded hover:bg-gray-100 text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: agentConfig.color }}
                  ></div>
                  <span className="text-gray-600">{agentConfig.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <StatusIcon size={16} />
                  {task.status}
                </div>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks yet. Create your first task to get started!</p>
        </div>
      )}
    </div>
  );
}

export default Tasks;
