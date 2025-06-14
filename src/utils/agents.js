// Agent System for CodeChrono IDE
export const AGENT_TYPES = {
  DEV: 'dev',
  MARKETING: 'marketing', 
  MANAGER: 'manager',
  CLIENT: 'client'
};

export const AGENT_CONFIG = {
  [AGENT_TYPES.DEV]: {
    name: 'Dev Agent',
    color: '#10B981',
    icon: 'Code',
    activities: ['commit', 'code', 'debug', 'review', 'deploy']
  },
  [AGENT_TYPES.MARKETING]: {
    name: 'Marketing Agent',
    color: '#F59E0B',
    icon: 'Megaphone',
    activities: ['campaign', 'content', 'analytics', 'social', 'email']
  },
  [AGENT_TYPES.MANAGER]: {
    name: 'Manager Agent', 
    color: '#EF4444',
    icon: 'Users',
    activities: ['planning', 'deadline', 'status', 'meeting', 'report']
  },
  [AGENT_TYPES.CLIENT]: {
    name: 'Client Agent',
    color: '#8B5CF6',
    icon: 'MessageSquare',
    activities: ['feedback', 'meeting', 'approval', 'requirement', 'communication']
  }
};

export const createAgentLog = (agentType, activity, description, metadata = {}) => ({
  id: Date.now() + Math.random(),
  agentType,
  activity,
  description,
  metadata,
  timestamp: new Date().toISOString(),
  status: 'active'
});

export const getAgentStats = (logs, agentType, timeframe = 'week') => {
  const now = new Date();
  const startDate = new Date();
  
  switch (timeframe) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }

  return logs.filter(log => 
    log.agentType === agentType && 
    new Date(log.timestamp) >= startDate
  ).length;
};
