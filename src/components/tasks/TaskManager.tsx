/**
 * Task management component
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, CheckCircle, Circle, Clock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAppContext } from '../../contexts/AppContext';
import { Task } from '../../types';
import { generateId, getCompletionPercentage } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

export function TaskManager() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('pomodoro-tasks', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { state, dispatch } = useAppContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'medium' as const,
    estimatedPomodoros: 4,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Work',
      priority: 'medium',
      estimatedPomodoros: 4,
    });
    setEditingTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...formData }
          : task
      ));
    } else {
      const newTask: Task = {
        id: generateId(),
        ...formData,
        completedPomodoros: 0,
        completed: false,
        createdAt: new Date(),
      };
      setTasks(prev => [...prev, newTask]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category,
      priority: task.priority,
      estimatedPomodoros: task.estimatedPomodoros,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (state.currentTask?.id === taskId) {
      dispatch({ type: 'SET_TASK', payload: null });
    }
  };

  const toggleComplete = (task: Task) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id 
        ? { 
            ...t, 
            completed: !t.completed, 
            completedAt: !t.completed ? new Date() : undefined 
          }
        : t
    ));
  };

  const selectTask = (task: Task) => {
    if (!task.completed) {
      dispatch({ type: 'SET_TASK', payload: task });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Active Tasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Active Tasks</h3>
        
        {activeTasks.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">No active tasks. Add one to get started!</p>
            </div>
          </Card>
        ) : (
          <AnimatePresence>
            {activeTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <Card 
                  hover 
                  className={`cursor-pointer transition-all ${
                    state.currentTask?.id === task.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : ''
                  }`}
                  onClick={() => selectTask(task)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComplete(task);
                          }}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Circle className="w-5 h-5" />
                        </button>
                        
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>
                            {task.completedPomodoros} / {task.estimatedPomodoros} Pomodoros
                          </span>
                          <span>
                            {getCompletionPercentage(task.completedPomodoros, task.estimatedPomodoros)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${getCompletionPercentage(task.completedPomodoros, task.estimatedPomodoros)}%`
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-500">{task.category}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {task.estimatedPomodoros * 25}m
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(task);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Completed Tasks</h3>
          
          <AnimatePresence>
            {completedTasks.slice(0, 5).map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 line-through">
                          {task.title}
                        </h4>
                        {task.completedAt && (
                          <p className="text-xs text-gray-500">
                            Completed {task.completedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Optional task description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Learning">Learning</option>
                <option value="Health">Health</option>
                <option value="Creative">Creative</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="estimatedPomodoros" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Pomodoros
            </label>
            <input
              type="number"
              id="estimatedPomodoros"
              min="1"
              max="20"
              value={formData.estimatedPomodoros}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedPomodoros: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Estimated time: {formData.estimatedPomodoros * 25} minutes
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}