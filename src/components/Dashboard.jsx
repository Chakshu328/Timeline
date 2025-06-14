import React, { useState, useEffect } from 'react';
import { storageManager, STORAGE_KEYS } from '../utils/storage';
import { AGENT_TYPES, getAgentStats } from '../utils/agents';
import { Code, TrendingUp, CheckCircle, Clock, Users, Zap } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    entriesThisWeek: 0,
    tasksDone: 0,
    activeTasks: 0,
    devActivity: 0,
    marketingActivity: 0,
    managerActivity: 0,
    clientActivity: 0
  });

  const [realtimeTasks, setRealtimeTasks] = useState([]);

  useEffect(() => {
    const updateStats = () => {
      const logs = storageManager.get(STORAGE_KEYS.LOGS) || [];
      const tasks = storageManager.get(STORAGE_KEYS.TASKS) || [];
      
      // Calculate week boundaries
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);

      const entriesThisWeek = logs.filter(log => 
        new Date(log.timestamp) >= startOfWeek
      ).length;

      const completedTasks = tasks.filter(task => task.status === 'completed');
      const activeTasks = tasks.filter(task => task.status === 'active' || task.status === 'in-progress');

      setStats({
        totalLogs: logs.length,
        entriesThisWeek,
        tasksDone: completedTasks.length,
        activeTasks: activeTasks.length,
        devActivity: getAgentStats(logs, AGENT_TYPES.DEV),
        marketingActivity: getAgentStats(logs, AGENT_TYPES.MARKETING),
        managerActivity: getAgentStats(logs, AGENT_TYPES.MANAGER),
        clientActivity: getAgentStats(logs, AGENT_TYPES.CLIENT)
      });

      setRealtimeTasks(activeTasks.slice(0, 5)); // Show latest 5 active tasks
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = "primary", trend }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="inline w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const AgentCard = ({ name, activity, color, type }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color }}></div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{activity} activities this week</p>
        </div>
        <div className="text-lg font-bold" style={{ color }}>
          {activity}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          Live Data
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Logs"
          value={stats.totalLogs}
          icon={Clock}
          color="blue"
          trend="+12% from last week"
        />
        <StatCard
          title="Entries This Week"
          value={stats.entriesThisWeek}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Tasks Done"
          value={stats.tasksDone}
          icon={CheckCircle}
          color="purple"
        />
        <StatCard
          title="Active Tasks"
          value={stats.activeTasks}
          icon={Zap}
          color="orange"
        />
      </div>

      {/* Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent Activity</h2>
          <div className="space-y-3">
            <AgentCard name="Dev Agent" activity={stats.devActivity} color="#10B981" type="dev" />
            <AgentCard name="Marketing Agent" activity={stats.marketingActivity} color="#F59E0B" type="marketing" />
            <AgentCard name="Manager Agent" activity={stats.managerActivity} color="#EF4444" type="manager" />
            <AgentCard name="Client Agent" activity={stats.clientActivity} color="#8B5CF6" type="client" />
          </div>
        </div>

        {/* Real-time Tasks */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Real-time Active Tasks</h2>
          <div className="space-y-3">
            {realtimeTasks.length > 0 ? (
              realtimeTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.assignedAgent || 'Unassigned'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
