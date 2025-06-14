
// AI Agent System for CodeChrono IDE
import { createAgentLog, AGENT_TYPES } from './agents';
import { storageManager, STORAGE_KEYS } from './storage';

export class AIAgent {
  constructor(type, name, capabilities = []) {
    this.type = type;
    this.name = name;
    this.capabilities = capabilities;
    this.isActive = false;
    this.currentTask = null;
    this.memory = [];
  }

  async processPrompt(prompt, context = {}) {
    this.isActive = true;
    console.log(`${this.name} processing: ${prompt}`);
    
    // Log the prompt
    const log = createAgentLog(
      this.type,
      'prompt_received',
      `Processing prompt: ${prompt}`,
      { prompt, context }
    );
    storageManager.addToArray(STORAGE_KEYS.LOGS, log);

    // Process based on agent type
    let result;
    switch (this.type) {
      case AGENT_TYPES.DEV:
        result = await this.processDevTask(prompt, context);
        break;
      case AGENT_TYPES.MARKETING:
        result = await this.processMarketingTask(prompt, context);
        break;
      case AGENT_TYPES.MANAGER:
        result = await this.processManagerTask(prompt, context);
        break;
      case AGENT_TYPES.CLIENT:
        result = await this.processClientTask(prompt, context);
        break;
      default:
        result = await this.processGenericTask(prompt, context);
    }

    this.isActive = false;
    return result;
  }

  async processDevTask(prompt, context) {
    const devTasks = {
      'code': () => this.generateCode(prompt),
      'debug': () => this.debugCode(prompt, context),
      'review': () => this.reviewCode(prompt, context),
      'refactor': () => this.refactorCode(prompt, context),
      'test': () => this.generateTests(prompt, context),
      'deploy': () => this.deployCode(prompt, context)
    };

    const taskType = this.identifyTaskType(prompt, Object.keys(devTasks));
    const task = devTasks[taskType] || devTasks['code'];
    
    return await task();
  }

  async processMarketingTask(prompt, context) {
    const marketingTasks = {
      'campaign': () => this.createCampaign(prompt),
      'content': () => this.generateContent(prompt),
      'social': () => this.manageSocial(prompt),
      'analytics': () => this.analyzeMetrics(prompt, context),
      'email': () => this.createEmail(prompt)
    };

    const taskType = this.identifyTaskType(prompt, Object.keys(marketingTasks));
    const task = marketingTasks[taskType] || marketingTasks['content'];
    
    return await task();
  }

  async processManagerTask(prompt, context) {
    const managerTasks = {
      'plan': () => this.createPlan(prompt),
      'schedule': () => this.scheduleTask(prompt),
      'report': () => this.generateReport(prompt, context),
      'meeting': () => this.organizeMeeting(prompt),
      'status': () => this.checkStatus(prompt, context)
    };

    const taskType = this.identifyTaskType(prompt, Object.keys(managerTasks));
    const task = managerTasks[taskType] || managerTasks['plan'];
    
    return await task();
  }

  async processClientTask(prompt, context) {
    const clientTasks = {
      'feedback': () => this.processFeedback(prompt),
      'meeting': () => this.scheduleMeeting(prompt),
      'requirement': () => this.analyzeRequirement(prompt),
      'communication': () => this.handleCommunication(prompt),
      'approval': () => this.requestApproval(prompt)
    };

    const taskType = this.identifyTaskType(prompt, Object.keys(clientTasks));
    const task = clientTasks[taskType] || clientTasks['communication'];
    
    return await task();
  }

  identifyTaskType(prompt, availableTasks) {
    const lowerPrompt = prompt.toLowerCase();
    for (const task of availableTasks) {
      if (lowerPrompt.includes(task)) {
        return task;
      }
    }
    return availableTasks[0]; // Default to first task
  }

  // Dev Agent Methods
  async generateCode(prompt) {
    const codeExamples = {
      'function': `function ${this.extractFunctionName(prompt)}() {\n  // TODO: Implement ${prompt}\n  console.log('${prompt}');\n}`,
      'class': `class ${this.extractClassName(prompt)} {\n  constructor() {\n    // TODO: Initialize ${prompt}\n  }\n}`,
      'api': `// API endpoint for ${prompt}\napp.get('/api/${this.extractEndpoint(prompt)}', (req, res) => {\n  // TODO: Implement ${prompt}\n  res.json({ message: 'Success' });\n});`,
      'component': `// React component for ${prompt}\nfunction ${this.extractComponentName(prompt)}() {\n  return (\n    <div>\n      <h1>${prompt}</h1>\n    </div>\n  );\n}`
    };

    const codeType = this.identifyCodeType(prompt);
    const code = codeExamples[codeType] || codeExamples['function'];

    this.logActivity('code_generated', `Generated ${codeType} code`, { code, prompt });
    return { type: 'code', content: code, language: 'javascript' };
  }

  async debugCode(prompt, context) {
    const debugSteps = [
      '1. Analyzing code structure...',
      '2. Checking for syntax errors...',
      '3. Validating logic flow...',
      '4. Testing edge cases...',
      '5. Generating debug report...'
    ];

    for (const step of debugSteps) {
      await this.delay(500);
      console.log(step);
    }

    const debugReport = `Debug Analysis for: ${prompt}\n\nPotential Issues Found:\n- Check variable initialization\n- Validate function parameters\n- Ensure proper error handling\n\nSuggested Fixes:\n- Add null checks\n- Implement try-catch blocks\n- Validate input data`;

    this.logActivity('code_debugged', 'Debug analysis completed', { prompt, report: debugReport });
    return { type: 'debug', content: debugReport };
  }

  // Marketing Agent Methods
  async generateContent(prompt) {
    const contentTypes = {
      'blog': `# ${prompt}\n\nThis is an engaging blog post about ${prompt}. Here's what you need to know:\n\n## Key Points\n- Important insight 1\n- Important insight 2\n- Important insight 3\n\n## Conclusion\nIn summary, ${prompt} is crucial for success.`,
      'social': `🚀 Exciting news! ${prompt}\n\n#innovation #technology #growth`,
      'email': `Subject: ${prompt}\n\nHi there!\n\nWe're excited to share ${prompt} with you.\n\nBest regards,\nThe Team`
    };

    const contentType = this.identifyContentType(prompt);
    const content = contentTypes[contentType] || contentTypes['blog'];

    this.logActivity('content_created', `Created ${contentType} content`, { prompt, content });
    return { type: 'content', contentType, content };
  }

  // Manager Agent Methods
  async createPlan(prompt) {
    const plan = {
      title: prompt,
      phases: [
        { name: 'Planning', duration: '1 week', tasks: ['Research', 'Define requirements', 'Create timeline'] },
        { name: 'Development', duration: '2 weeks', tasks: ['Design', 'Code', 'Test'] },
        { name: 'Launch', duration: '1 week', tasks: ['Deploy', 'Monitor', 'Support'] }
      ],
      milestones: ['Requirements Complete', 'MVP Ready', 'Launch Complete'],
      resources: ['Development Team', 'Design Team', 'QA Team']
    };

    this.logActivity('plan_created', `Created project plan`, { prompt, plan });
    return { type: 'plan', content: plan };
  }

  // Client Agent Methods
  async processFeedback(prompt) {
    const feedback = {
      original: prompt,
      category: this.categorizeFeedback(prompt),
      priority: this.prioritizeFeedback(prompt),
      actionItems: this.extractActionItems(prompt),
      response: `Thank you for your feedback regarding "${prompt}". We'll review this and get back to you with updates.`
    };

    this.logActivity('feedback_processed', 'Client feedback processed', { prompt, feedback });
    return { type: 'feedback', content: feedback };
  }

  // Utility Methods
  identifyCodeType(prompt) {
    if (prompt.includes('function') || prompt.includes('method')) return 'function';
    if (prompt.includes('class') || prompt.includes('object')) return 'class';
    if (prompt.includes('api') || prompt.includes('endpoint')) return 'api';
    if (prompt.includes('component') || prompt.includes('ui')) return 'component';
    return 'function';
  }

  identifyContentType(prompt) {
    if (prompt.includes('blog') || prompt.includes('article')) return 'blog';
    if (prompt.includes('social') || prompt.includes('tweet')) return 'social';
    if (prompt.includes('email') || prompt.includes('newsletter')) return 'email';
    return 'blog';
  }

  extractFunctionName(prompt) {
    const words = prompt.split(' ').filter(w => w.length > 2);
    return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  }

  extractClassName(prompt) {
    const words = prompt.split(' ').filter(w => w.length > 2);
    return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Class';
  }

  extractComponentName(prompt) {
    const words = prompt.split(' ').filter(w => w.length > 2);
    return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Component';
  }

  extractEndpoint(prompt) {
    return prompt.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  categorizeFeedback(prompt) {
    if (prompt.includes('bug') || prompt.includes('error')) return 'bug';
    if (prompt.includes('feature') || prompt.includes('add')) return 'feature';
    if (prompt.includes('improve') || prompt.includes('better')) return 'improvement';
    return 'general';
  }

  prioritizeFeedback(prompt) {
    if (prompt.includes('urgent') || prompt.includes('critical')) return 'high';
    if (prompt.includes('important') || prompt.includes('asap')) return 'medium';
    return 'low';
  }

  extractActionItems(prompt) {
    return [
      'Review feedback details',
      'Assess feasibility',
      'Create implementation plan',
      'Communicate timeline to client'
    ];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  logActivity(activity, description, metadata = {}) {
    const log = createAgentLog(this.type, activity, description, metadata);
    storageManager.addToArray(STORAGE_KEYS.LOGS, log);
  }

  async processGenericTask(prompt, context) {
    await this.delay(1000);
    const response = `I've processed your request: "${prompt}". Here's what I can help you with based on my capabilities.`;
    
    this.logActivity('generic_task', response, { prompt, context });
    return { type: 'generic', content: response };
  }
}

// Agent Manager Class
export class AgentManager {
  constructor() {
    this.agents = {
      [AGENT_TYPES.DEV]: new AIAgent(AGENT_TYPES.DEV, 'Dev Agent', ['coding', 'debugging', 'testing']),
      [AGENT_TYPES.MARKETING]: new AIAgent(AGENT_TYPES.MARKETING, 'Marketing Agent', ['content', 'campaigns', 'social']),
      [AGENT_TYPES.MANAGER]: new AIAgent(AGENT_TYPES.MANAGER, 'Manager Agent', ['planning', 'scheduling', 'reporting']),
      [AGENT_TYPES.CLIENT]: new AIAgent(AGENT_TYPES.CLIENT, 'Client Agent', ['feedback', 'communication', 'requirements'])
    };
  }

  async sendPromptToAgent(agentType, prompt, context = {}) {
    const agent = this.agents[agentType];
    if (!agent) {
      throw new Error(`Agent type ${agentType} not found`);
    }

    return await agent.processPrompt(prompt, context);
  }

  async sendPromptToAllAgents(prompt, context = {}) {
    const results = {};
    for (const [type, agent] of Object.entries(this.agents)) {
      try {
        results[type] = await agent.processPrompt(prompt, context);
      } catch (error) {
        results[type] = { type: 'error', content: error.message };
      }
    }
    return results;
  }

  getAgentStatus(agentType) {
    const agent = this.agents[agentType];
    return agent ? {
      type: agent.type,
      name: agent.name,
      isActive: agent.isActive,
      currentTask: agent.currentTask,
      capabilities: agent.capabilities
    } : null;
  }

  getAllAgentsStatus() {
    const status = {};
    for (const [type, agent] of Object.entries(this.agents)) {
      status[type] = this.getAgentStatus(type);
    }
    return status;
  }
}

// Global agent manager instance
export const agentManager = new AgentManager();
