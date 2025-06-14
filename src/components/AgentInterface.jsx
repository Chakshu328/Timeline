
import React, { useState, useEffect } from 'react';
import { agentManager } from '../utils/aiAgents';
import { AGENT_TYPES, AGENT_CONFIG } from '../utils/agents';
import { Send, Bot, User, Code, MessageSquare, Users, TrendingUp, Loader } from 'lucide-react';
import AgentCodeEditor from './AgentCodeEditor';

function AgentInterface() {
  const [selectedAgent, setSelectedAgent] = useState(AGENT_TYPES.DEV);
  const [prompt, setPrompt] = useState('');
  const [conversations, setConversations] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState({});

  useEffect(() => {
    // Update agent statuses periodically
    const interval = setInterval(() => {
      setAgentStatuses(agentManager.getAllAgentsStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getAgentIcon = (agentType) => {
    switch (agentType) {
      case AGENT_TYPES.DEV: return Code;
      case AGENT_TYPES.MARKETING: return TrendingUp;
      case AGENT_TYPES.MANAGER: return Users;
      case AGENT_TYPES.CLIENT: return MessageSquare;
      default: return Bot;
    }
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim() || isProcessing) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    };

    // Add user message to conversation
    setConversations(prev => ({
      ...prev,
      [selectedAgent]: [...(prev[selectedAgent] || []), userMessage]
    }));

    setIsProcessing(true);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const response = await agentManager.sendPromptToAgent(selectedAgent, currentPrompt);
      
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: response,
        timestamp: new Date().toISOString()
      };

      setConversations(prev => ({
        ...prev,
        [selectedAgent]: [...(prev[selectedAgent] || []), agentMessage]
      }));
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      };

      setConversations(prev => ({
        ...prev,
        [selectedAgent]: [...(prev[selectedAgent] || []), errorMessage]
      }));
    }

    setIsProcessing(false);
  };

  const handleSendToAllAgents = async () => {
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const responses = await agentManager.sendPromptToAllAgents(currentPrompt);
      
      // Add responses to each agent's conversation
      Object.entries(responses).forEach(([agentType, response]) => {
        const userMessage = {
          id: Date.now() + Math.random(),
          type: 'user',
          content: currentPrompt,
          timestamp: new Date().toISOString()
        };

        const agentMessage = {
          id: Date.now() + Math.random() + 1,
          type: 'agent',
          content: response,
          timestamp: new Date().toISOString()
        };

        setConversations(prev => ({
          ...prev,
          [agentType]: [...(prev[agentType] || []), userMessage, agentMessage]
        }));
      });
    } catch (error) {
      console.error('Error sending to all agents:', error);
    }

    setIsProcessing(false);
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
            <p className="text-gray-900 dark:text-white">{message.content}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      );
    }

    if (message.type === 'agent') {
      const agentConfig = AGENT_CONFIG[selectedAgent];
      return (
        <div className="flex items-start gap-3 mb-4">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: agentConfig.color }}
          >
            <Bot size={16} className="text-white" />
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            {message.content.type === 'code' ? (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Generated Code:</p>
                <AgentCodeEditor 
                  code={message.content.content} 
                  language={message.content.language || 'javascript'}
                />
              </div>
            ) : message.content.type === 'plan' ? (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Project Plan:</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{message.content.content.title}</h4>
                  {message.content.content.phases.map((phase, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 p-2 rounded">
                      <p className="font-medium text-gray-900 dark:text-white">{phase.name} ({phase.duration})</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                        {phase.tasks.map((task, taskIndex) => (
                          <li key={taskIndex}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-900 dark:text-white">{message.content.content || message.content}</p>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div className="flex-1 bg-red-50 dark:bg-red-900 p-3 rounded-lg">
          <p className="text-red-900 dark:text-red-100">{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Agents</h1>
        <div className="flex items-center gap-2">
          {Object.entries(agentStatuses).map(([type, status]) => (
            <div key={type} className="flex items-center gap-1">
              <div 
                className={`w-2 h-2 rounded-full ${status?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">{status?.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(AGENT_CONFIG).map(([key, config]) => {
          const Icon = getAgentIcon(key);
          const isActive = selectedAgent === key;
          const status = agentStatuses[key];
          
          return (
            <button
              key={key}
              onClick={() => setSelectedAgent(key)}
              className={`p-4 rounded-xl border-2 transition-all ${
                isActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">{config.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {status?.isActive ? 'Active' : 'Ready'}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Conversation Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 overflow-y-auto">
        <div className="max-h-96 overflow-y-auto">
          {conversations[selectedAgent]?.length > 0 ? (
            conversations[selectedAgent].map((message) => (
              <div key={message.id}>
                {renderMessage(message)}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bot size={48} className="mx-auto mb-4 opacity-50" />
              <p>Start a conversation with {AGENT_CONFIG[selectedAgent].name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder={`Ask ${AGENT_CONFIG[selectedAgent].name} anything...`}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isProcessing}
          />
          <button
            onClick={handleSendPrompt}
            disabled={isProcessing || !prompt.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
            Send
          </button>
          <button
            onClick={handleSendToAllAgents}
            disabled={isProcessing || !prompt.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            All Agents
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Try: "Create a login function", "Write a marketing campaign", "Plan a project timeline", "Process client feedback"
        </div>
      </div>
    </div>
  );
}

export default AgentInterface;
