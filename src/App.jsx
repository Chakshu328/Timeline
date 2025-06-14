import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CodeIDE from './components/CodeIDE';
import Tasks from './components/Tasks';
import Timeline from './components/Timeline';
import AgentInterface from './components/AgentInterface';
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
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h1>
              <button 
                onClick={() => {
                  const name = prompt('Enter member name:');
                  const role = prompt('Enter member role:');
                  if (name && role) {
                    alert(`${name} added as ${role}!`);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Member
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Schedule Meeting', icon: '📅', action: () => alert('Meeting scheduled!') },
                  { label: 'Send Notification', icon: '📢', action: () => alert('Notification sent!') },
                  { label: 'Create Task', icon: '✅', action: () => alert('Task created!') },
                  { label: 'Generate Report', icon: '📊', action: () => alert('Report generated!') }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team Members */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Members</h2>
                <div className="space-y-3">
                  {[
                    { name: 'John Doe', role: 'Lead Developer', status: 'online', avatar: '#10B981', performance: 95 },
                    { name: 'Sarah Chen', role: 'UI/UX Designer', status: 'away', avatar: '#F59E0B', performance: 88 },
                    { name: 'Mike Johnson', role: 'Backend Developer', status: 'offline', avatar: '#EF4444', performance: 92 },
                    { name: 'Emma Wilson', role: 'Project Manager', status: 'online', avatar: '#8B5CF6', performance: 97 }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: member.avatar }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <span className={`w-3 h-3 rounded-full inline-block ${member.status === 'online' ? 'bg-green-500' : member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{member.performance}% ⭐</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Performance */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Performance</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Overall Performance</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">93%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '93%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">147/160</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '91.9%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Code Quality</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">A+</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">24</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Sprints Completed</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">98%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">On-time Delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Activity */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {[
                    { user: 'John Doe', action: 'committed code to main branch', time: '2 minutes ago', type: 'commit' },
                    { user: 'Sarah Chen', action: 'updated UI mockups', time: '15 minutes ago', type: 'design' },
                    { user: 'Mike Johnson', action: 'fixed API endpoint bug', time: '1 hour ago', type: 'fix' },
                    { user: 'Emma Wilson', action: 'created new project milestone', time: '2 hours ago', type: 'management' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        activity.type === 'commit' ? 'bg-green-100 text-green-600' :
                        activity.type === 'design' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'fix' ? 'bg-red-100 text-red-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'commit' ? '💾' : activity.type === 'design' ? '🎨' : activity.type === 'fix' ? '🔧' : '📋'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'agents':
        return <AgentInterface />;
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
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Font Size</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adjust the default font size</p>
                  </div>
                  <select defaultValue="Medium" className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color Scheme</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Blue', color: '#3B82F6', selected: true },
                  { name: 'Green', color: '#10B981' },
                  { name: 'Purple', color: '#8B5CF6' },
                  { name: 'Orange', color: '#F59E0B' }
                ].map((scheme, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${scheme.selected ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <div className="w-full h-6 rounded-md mb-2" style={{ backgroundColor: scheme.color }}></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{scheme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy and Security */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy & Security</h3>
              <div className="space-y-4">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', type: 'toggle' },
                  { label: 'Auto-lock Session', desc: 'Automatically lock after 30 minutes of inactivity', type: 'toggle' },
                  { label: 'Data Encryption', desc: 'Encrypt sensitive data locally', type: 'toggle' },
                  { label: 'Privacy Mode', desc: 'Hide sensitive information in screenshots', type: 'toggle' }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{setting.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked={index < 2} className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive email updates for important events' },
                  { label: 'Push Notifications', desc: 'Get browser notifications for real-time updates' },
                  { label: 'Task Reminders', desc: 'Receive reminders for upcoming deadlines' },
                  { label: 'Team Updates', desc: 'Get notified about team member activities' },
                  { label: 'Agent Alerts', desc: 'Notifications when AI agents complete tasks' }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{setting.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  📤 Export All Data
                </button>
                <button
                  onClick={() => alert('Backup created successfully!')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  💾 Create Backup
                </button>
                <button
                  onClick={() => alert('Cache cleared!')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  🗑️ Clear Cache
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
                  ⚠️ Clear All Data
                </button>
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  💾 Storage used: <span className="font-semibold">2.4 MB</span> of available space
                </p>
              </div>
            </div>

            {/* About and Help */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About & Help</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">CodeChrono IDE</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Version 2.1.0</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Built with React & AI</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Need Help?</h4>
                    <div className="space-y-2">
                      <button className="text-sm text-blue-600 hover:text-blue-700 block">📚 Documentation</button>
                      <button className="text-sm text-blue-600 hover:text-blue-700 block">💬 Support Chat</button>
                      <button className="text-sm text-blue-600 hover:text-blue-700 block">🐛 Report Bug</button>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    🚀 Thank you for using CodeChrono IDE! Your AI-powered development companion.
                  </p>
                </div>
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