import React from 'react';
import { Code, BarChart3, Calendar, MessageSquare, Settings, Download, Users, Clock, Activity } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, onExportData }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'ide', label: 'Code IDE', icon: Code },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'tasks', label: 'Tasks', icon: Calendar },
    { id: 'logs', label: 'Logs', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">CodeChrono IDE</h1>
        <p className="text-sm text-gray-500 mt-1">Development Tracker</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onExportData}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Download size={20} />
          Export Data
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
