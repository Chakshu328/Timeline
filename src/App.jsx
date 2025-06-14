import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CodeIDE from './components/CodeIDE';
import Tasks from './components/Tasks';
import Timeline from './components/Timeline';
import { storageManager } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
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
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onExportData={handleExportData}
        />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </Router>
  );
}

export default App;
