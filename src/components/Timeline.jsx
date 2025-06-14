import React, { useState, useEffect } from 'react';
import { storageManager, STORAGE_KEYS } from '../utils/storage';
import { AGENT_CONFIG, AGENT_TYPES } from '../utils/agents';
import { format, isToday, isYesterday, startOfWeek, endOfWeek } from 'date-fns';
import { Filter, Clock, GitCommit, Bug, CheckCircle, Code, TrendingUp, MessageSquare, Users } from 'lucide-react';

function Timeline() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({
    agent: 'all',
    activity: 'all',
    timeframe: 'week'
  });

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const loadLogs = () => {
    const savedLogs = storageManager.get(STORAGE_KEYS.LOGS) || [];
    setLogs(savedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Filter by agent
    if (filters.agent !== 'all') {
      filtered = filtered.filter(log => log.agentType === filters.agent);
    }

    // Filter by activity
    if (filters.activity !== 'all') {
      filtered = filtered.filter(log => log.activity === filters.activity);
    }

    // Filter by timeframe
    const now = new Date();
    switch (filters.timeframe) {
      case 'today':
        filtered = filtered.filter(log => isToday(new Date(log.timestamp)));
        break;
      case 'yesterday':
        filtered = filtered.filter(log => isYesterday(new Date(log.timestamp)));
        break;
      case 'week':
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        filtered = filtered.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= weekStart && logDate <= weekEnd;
        });
        break;
    }

    setFilteredLogs(filtered);
  };

  const getActivityIcon = (activity) => {
    switch (activity) {
      case 'commit': return GitCommit;
      case 'code_edit': return Code;
      case 'bug_fix': return Bug;
      case 'task_completed': return CheckCircle;
      case 'campaign': return TrendingUp;
      case 'meeting': return MessageSquare;
      case 'planning': return Users;
      default: return Clock;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return format(date, 'MMM d, HH:mm');
  };

  const groupLogsByDate = (logs) => {
    const groups = {};
    logs.forEach(log => {
      const date = format(new Date(log.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });
    return groups;
  };

  const getDateLabel = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const groupedLogs = groupLogsByDate(filteredLogs);

  // Get unique activities for filter
  const uniqueActivities = [...new Set(logs.map(log => log.activity))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          Real-time Updates
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.agent}
            onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">All Agents</option>
            {Object.entries(AGENT_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.name}</option>
            ))}
          </select>

          <select
            value={filters.activity}
            onChange={(e) => setFilters({ ...filters, activity: e.target.value })}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">All Activities</option>
            {uniqueActivities.map(activity => (
              <option key={activity} value={activity}>
                {activity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>

          <select
            value={filters.timeframe}
            onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="week">This Week</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={() => setFilters({ agent: 'all', activity: 'all', timeframe: 'week' })}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.keys(groupedLogs).length > 0 ? (
          Object.entries(groupedLogs).map(([date, dayLogs]) => (
            <div key={date} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 sticky top-0 bg-gray-50 py-2 px-4 rounded-lg">
                {getDateLabel(date)} ({dayLogs.length} activities)
              </h2>
              
              <div className="space-y-3">
                {dayLogs.map((log) => {
                  const agentConfig = AGENT_CONFIG[log.agentType];
                  const ActivityIcon = getActivityIcon(log.activity);
                  
                  return (
                    <div key={log.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: agentConfig.color + '20' }}
                        >
                          <ActivityIcon 
                            size={20} 
                            style={{ color: agentConfig.color }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span 
                                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: agentConfig.color }}
                              >
                                {agentConfig.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {log.activity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                            <span className="text-sm text-gray-400">
                              {formatTimeAgo(log.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-gray-900 mt-1">{log.description}</p>
                          
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                              {Object.entries(log.metadata).map(([key, value]) => (
                                <span key={key} className="mr-3">
                                  {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No activities found for the selected filters.</p>
            <p className="text-sm text-gray-400 mt-2">Start coding or create tasks to see your timeline!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timeline;
