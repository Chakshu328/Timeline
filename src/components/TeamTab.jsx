
import React, { useState, useEffect } from 'react';
import { Users, Plus, TrendingUp, Clock, Award, Settings, Trash2, UserPlus } from 'lucide-react';
import { storageManager, STORAGE_KEYS } from '../utils/storage';

function TeamTab() {
  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe', role: 'Lead Developer', status: 'active', performance: 92, tasks: 15, avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff' },
    { id: 2, name: 'Jane Smith', role: 'UI/UX Designer', status: 'active', performance: 88, tasks: 12, avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff' },
    { id: 3, name: 'Mike Johnson', role: 'Backend Developer', status: 'busy', performance: 85, tasks: 18, avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff' }
  ]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '' });

  useEffect(() => {
    const savedMembers = storageManager.get('team_members');
    if (savedMembers) {
      setMembers(savedMembers);
    }
  }, []);

  const saveMembers = (updatedMembers) => {
    setMembers(updatedMembers);
    storageManager.set('team_members', updatedMembers);
  };

  const addMember = () => {
    if (newMember.name && newMember.role) {
      const member = {
        id: Date.now(),
        name: newMember.name,
        role: newMember.role,
        email: newMember.email,
        status: 'active',
        performance: Math.floor(Math.random() * 20) + 80,
        tasks: Math.floor(Math.random() * 10) + 5,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name)}&background=random&color=fff`
      };
      
      saveMembers([...members, member]);
      setNewMember({ name: '', role: '', email: '' });
      setShowAddMember(false);
    }
  };

  const removeMember = (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      saveMembers(members.filter(m => m.id !== id));
    }
  };

  const quickActions = [
    { name: 'Schedule Team Meeting', icon: Clock, action: () => alert('Meeting scheduled for tomorrow 2 PM') },
    { name: 'Send Team Update', icon: TrendingUp, action: () => alert('Team update sent to all members') },
    { name: 'Generate Performance Report', icon: Award, action: () => alert('Performance report generated') },
    { name: 'Team Settings', icon: Settings, action: () => alert('Opening team settings...') }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your team members and performance</p>
        </div>
        <button
          onClick={() => setShowAddMember(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          Add Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{members.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Performance</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.round(members.reduce((acc, m) => acc + m.performance, 0) / members.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {members.reduce((acc, m) => acc + m.tasks, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {members.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h3>
        </div>
        <div className="p-4">
          <div className="grid gap-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                    {member.email && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">{member.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{member.performance}%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Performance</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{member.tasks}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Active Tasks</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
              >
                <action.icon size={20} className="text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter member name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role *
                </label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="member@company.com"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={addMember}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowAddMember(false)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamTab;
