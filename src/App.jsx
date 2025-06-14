import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CodeIDE from './components/CodeIDE';
import Tasks from './components/Tasks';
import Timeline from './components/Timeline';
import { storageManager } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleExportData = () => {
    const data = storageManager.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codechrono-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ide':
        return <CodeIDE />;
      case 'tasks':
        return <Tasks />;
      case 'timeline':
        return <Timeline />;
      case 'team':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Team Management</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Members</h2>
                <div className="space-y-3">
                  {[
                    { name: 'John Doe', role: 'Lead Developer', status: 'online', avatar: '#10B981' },
                    { name: 'Sarah Chen', role: 'UI/UX Designer', status: 'away', avatar: '#F59E0B' },
                    { name: 'Mike Johnson', role: 'Backend Developer', status: 'offline', avatar: '#EF4444' },
                    { name: 'Emma Wilson', role: 'Project Manager', status: 'online', avatar: '#8B5CF6' }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: member.avatar }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                      <span className={`w-3 h-3 rounded-full ${member.status === 'online' ? 'bg-green-500' : member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Activity</h2>
                <div className="space-y-3">
                  {[
                    { user: 'John Doe', action: 'committed code to main branch', time: '2 minutes ago' },
                    { user: 'Sarah Chen', action: 'updated UI mockups', time: '15 minutes ago' },
                    { user: 'Mike Johnson', action: 'fixed API endpoint bug', time: '1 hour ago' },
                    { user: 'Emma Wilson', action: 'created new project milestone', time: '2 hours ago' }
                  ].map((activity, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'agents':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Agents</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries({
                dev: { name: 'Dev Agent', color: '#10B981', description: 'Tracks code commits, debugging, and development activities' },
                marketing: { name: 'Marketing Agent', color: '#F59E0B', description: 'Manages campaigns, content creation, and engagement tracking' },
                manager: { name: 'Manager Agent', color: '#EF4444', description: 'Oversees project deadlines, status updates, and team coordination' },
                client: { name: 'Client Agent', color: '#8B5CF6', description: 'Handles client feedback, meetings, and communication' }
              }).map(([key, agent]) => (
                <div key={key} className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: agent.color }}></div>
                    <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                  </div>
                  <p className="text-gray-600">{agent.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'logs':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">System Logs</h1>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600">All system activities are automatically logged and can be viewed in the Timeline section.</p>
              <button
                onClick={handleExportData}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Export All Logs as JSON
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
            
            {/* Appearance Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Font Size</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adjust the default font size</p>
                  </div>
                  <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Small</option>
                    <option selected>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive email updates for important events' },
                  { label: 'Push Notifications', desc: 'Get browser notifications for real-time updates' },
                  { label: 'Task Reminders', desc: 'Receive reminders for upcoming deadlines' }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{setting.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h3>
              <div className="space-y-4">
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export All Data
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                      storageManager.clearAll();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onExportData={handleExportData}
          isDarkMode={isDarkMode}
        />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </Router>
  );
}

export default App;
