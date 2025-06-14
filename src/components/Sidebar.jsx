import React from 'react';
import { Code, BarChart3, Calendar, MessageSquare, Settings, Download, Users, Clock, Activity } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, onExportData, isDarkMode }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'ide', label: 'Code IDE', icon: Code },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'tasks', label: 'Tasks', icon: Calendar },
    { id: 'logs', label: 'Logs', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r h-screen flex flex-col`}>
      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CodeChrono IDE</h1>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Development Tracker</p>
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
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
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

      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={onExportData}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Download size={20} />
          Export Data
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
