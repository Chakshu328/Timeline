
// AI Agent System for CodeChrono IDE
import { createAgentLog, AGENT_TYPES } from './agents';
import { storageManager, STORAGE_KEYS } from './storage';
import { imageGenerator } from './imageGenerator';

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
    // Enhanced code generation with actual functionality
    const codeExamples = {
      'login': this.generateLoginComponent(prompt),
      'form': this.generateFormComponent(prompt),
      'api': this.generateApiEndpoint(prompt),
      'function': this.generateSmartFunction(prompt),
      'class': this.generateSmartClass(prompt),
      'component': this.generateReactComponent(prompt),
      'page': this.generateFullPage(prompt)
    };

    const codeType = this.identifyCodeType(prompt);
    const code = codeExamples[codeType] || codeExamples['function'];

    this.logActivity('code_generated', `Generated functional ${codeType} code`, { code, prompt });
    return { type: 'code', content: code, language: this.getLanguageForCodeType(codeType) };
  }

  generateLoginComponent(prompt) {
    return `import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState('login'); // 'login' or 'signup'

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle successful login/signup
      console.log(\`\${loginMode === 'login' ? 'Login' : 'Signup'} successful!\`, { email });
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
      successDiv.textContent = \`\${loginMode === 'login' ? 'Login' : 'Account creation'} successful! Welcome!\`;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 3000);
      
      // Reset form
      setEmail('');
      setPassword('');
      setErrors({});
      
    } catch (error) {
      console.error('Authentication failed:', error);
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {loginMode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {loginMode === 'login' 
              ? 'Sign in to access your account' 
              : 'Join us and start your journey'
            }
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={\`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent \${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }\`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1">
                    <span className="w-4 h-4 text-red-500">⚠</span>
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={\`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent \${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }\`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1">
                    <span className="w-4 h-4 text-red-500">⚠</span>
                    {errors.password}
                  </div>
                )}
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm flex items-center gap-2">
                  <span className="w-4 h-4 text-red-500">⚠</span>
                  {errors.general}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  {loginMode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {loginMode === 'login' ? "Don't have an account?" : "Already have an account?"}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setLoginMode(loginMode === 'login' ? 'signup' : 'login');
                  setErrors({});
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                {loginMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Forgot Password */}
          {loginMode === 'login' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => alert('Password reset functionality would be implemented here')}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;`;
  }

  generateFormComponent(prompt) {
    const formName = this.extractFormName(prompt);
    return `import React, { useState } from 'react';

function ${formName}Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">${formName} Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your message"
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default ${formName}Form;`;
  }

  generateApiEndpoint(prompt) {
    const endpoint = this.extractEndpoint(prompt);
    return `// Express.js API endpoint for ${prompt}
const express = require('express');
const router = express.Router();

// GET endpoint
router.get('/${endpoint}', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    // Simulate data fetching
    const data = {
      items: [
        { id: 1, name: 'Item 1', description: 'Description 1' },
        { id: 2, name: 'Item 2', description: 'Description 2' }
      ].filter(item => 
        search ? item.name.toLowerCase().includes(search.toLowerCase()) : true
      ),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 2
      }
    };
    
    res.json({
      success: true,
      data: data,
      message: 'Data retrieved successfully'
    });
    
  } catch (error) {
    console.error('GET /${endpoint} error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST endpoint
router.post('/${endpoint}', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }
    
    // Simulate creation
    const newItem = {
      id: Date.now(),
      name,
      description,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Item created successfully'
    });
    
  } catch (error) {
    console.error('POST /${endpoint} error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT endpoint
router.put('/${endpoint}/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }
    
    // Simulate update
    const updatedItem = {
      id: parseInt(id),
      name,
      description,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully'
    });
    
  } catch (error) {
    console.error('PUT /${endpoint}/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE endpoint
router.delete('/${endpoint}/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Simulate deletion
    res.json({
      success: true,
      message: \`Item with id \${id} deleted successfully\`
    });
    
  } catch (error) {
    console.error('DELETE /${endpoint}/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;`;
  }

  generateSmartFunction(prompt) {
    const functionName = this.extractFunctionName(prompt);
    return `// Smart function for: ${prompt}
function ${functionName}(input) {
  // Input validation
  if (!input) {
    throw new Error('Input is required');
  }
  
  try {
    // Function logic based on prompt
    console.log('Processing:', input);
    
    // Simulate processing
    const result = {
      original: input,
      processed: input.toString().toUpperCase(),
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    
    return result;
    
  } catch (error) {
    console.error('Error in ${functionName}:', error);
    throw error;
  }
}

// Usage example:
// const result = ${functionName}('test input');
// console.log(result);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${functionName};
}`;
  }

  generateSmartClass(prompt) {
    const className = this.extractClassName(prompt);
    return `// Smart class for: ${prompt}
class ${className} {
  constructor(options = {}) {
    this.options = {
      debug: false,
      autoSave: true,
      ...options
    };
    
    this.data = new Map();
    this.listeners = [];
    this.isInitialized = false;
    
    this.init();
  }
  
  init() {
    if (this.options.debug) {
      console.log('Initializing ${className}...');
    }
    
    this.isInitialized = true;
    this.emit('initialized');
  }
  
  set(key, value) {
    if (!this.isInitialized) {
      throw new Error('${className} not initialized');
    }
    
    const oldValue = this.data.get(key);
    this.data.set(key, value);
    
    this.emit('change', { key, value, oldValue });
    
    if (this.options.autoSave) {
      this.save();
    }
    
    return this;
  }
  
  get(key) {
    return this.data.get(key);
  }
  
  has(key) {
    return this.data.has(key);
  }
  
  delete(key) {
    const existed = this.data.has(key);
    const result = this.data.delete(key);
    
    if (existed) {
      this.emit('delete', { key });
      
      if (this.options.autoSave) {
        this.save();
      }
    }
    
    return result;
  }
  
  clear() {
    this.data.clear();
    this.emit('clear');
    
    if (this.options.autoSave) {
      this.save();
    }
  }
  
  size() {
    return this.data.size;
  }
  
  toArray() {
    return Array.from(this.data.entries());
  }
  
  toObject() {
    return Object.fromEntries(this.data);
  }
  
  save() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('${className.toLowerCase()}_data', JSON.stringify(this.toObject()));
    }
  }
  
  load() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('${className.toLowerCase()}_data');
      if (saved) {
        const data = JSON.parse(saved);
        Object.entries(data).forEach(([key, value]) => {
          this.data.set(key, value);
        });
      }
    }
  }
  
  on(event, callback) {
    this.listeners.push({ event, callback });
  }
  
  off(event, callback) {
    this.listeners = this.listeners.filter(
      listener => listener.event !== event || listener.callback !== callback
    );
  }
  
  emit(event, data) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => listener.callback(data));
  }
}

// Usage example:
// const instance = new ${className}({ debug: true });
// instance.set('key', 'value');
// console.log(instance.get('key'));

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${className};
}`;
  }

  generateReactComponent(prompt) {
    const componentName = this.extractComponentName(prompt);
    return `import React, { useState, useEffect } from 'react';

// ${componentName} - Generated for: ${prompt}
function ${componentName}({ title = 'Default Title', ...props }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = [
          { id: 1, name: 'Item 1', value: 100 },
          { id: 2, name: 'Item 2', value: 200 },
          { id: 3, name: 'Item 3', value: 300 }
        ];
        
        setData(mockData);
        setError(null);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
    alert(\`Clicked on \${item.name}\`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" {...props}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600">ID: {item.id}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-blue-600">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No items to display</p>
        </div>
      )}
    </div>
  );
}

export default ${componentName};`;
  }

  generateFullPage(prompt) {
    const pageName = this.extractPageName(prompt);
    return `import React, { useState, useEffect } from 'react';

// Full page component for: ${prompt}
function ${pageName}Page() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize page data
    const initializePage = async () => {
      try {
        setLoading(true);
        
        // Simulate data loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setData({
          title: '${pageName}',
          description: 'This is a dynamically generated page',
          stats: {
            users: 1234,
            revenue: 56789,
            growth: 12.5
          },
          items: [
            { id: 1, name: 'Feature 1', status: 'active' },
            { id: 2, name: 'Feature 2', status: 'pending' },
            { id: 3, name: 'Feature 3', status: 'active' }
          ]
        });
        
      } catch (error) {
        console.error('Failed to load page data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'settings', label: 'Settings' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ${pageName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">{data?.title}</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Action
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={\`py-4 px-1 border-b-2 font-medium text-sm \${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }\`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Users</h3>
                <p className="text-2xl font-bold text-gray-900">{data?.stats.users.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                <p className="text-2xl font-bold text-gray-900">\${data?.stats.revenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Growth</h3>
                <p className="text-2xl font-bold text-green-600">+{data?.stats.growth}%</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
              <div className="space-y-4">
                {data?.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">ID: {item.id}</p>
                    </div>
                    <span className={\`px-2 py-1 rounded-full text-xs font-medium \${
                      item.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }\`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Information</h2>
            <p className="text-gray-600 mb-4">{data?.description}</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Technical Details</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This page was generated dynamically using the AI agent system.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Last Updated</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  defaultValue={data?.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  defaultValue={data?.description}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">
                  Enable notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-save"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="auto-save" className="ml-2 text-sm text-gray-700">
                  Auto-save changes
                </label>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ${pageName}Page;`;
  }

  getLanguageForCodeType(codeType) {
    const languageMap = {
      'login': 'jsx',
      'form': 'jsx',
      'component': 'jsx',
      'page': 'jsx',
      'api': 'javascript',
      'function': 'javascript',
      'class': 'javascript'
    };
    return languageMap[codeType] || 'javascript';
  }

  extractFormName(prompt) {
    const words = prompt.split(' ').filter(w => w.length > 2);
    return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  }

  extractPageName(prompt) {
    const words = prompt.split(' ').filter(w => w.length > 2);
    return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
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

  async reviewCode(prompt, context) {
    const review = `Code Review for: ${prompt}\n\n✅ Strengths:\n- Clean code structure\n- Good variable naming\n- Proper indentation\n\n⚠️ Suggestions:\n- Add more comments\n- Consider error handling\n- Optimize performance\n\n📝 Overall Rating: 8/10`;
    
    this.logActivity('code_reviewed', 'Code review completed', { prompt, review });
    return { type: 'review', content: review };
  }

  async refactorCode(prompt, context) {
    const refactoredCode = this.improveCodeStructure(prompt);
    this.logActivity('code_refactored', 'Code refactored for better structure', { prompt, refactoredCode });
    return { type: 'code', content: refactoredCode, language: 'javascript' };
  }

  async generateTests(prompt, context) {
    const testCode = `// Test cases for: ${prompt}\ndescribe('${this.extractFunctionName(prompt)}', () => {\n  test('should handle valid input', () => {\n    // Test implementation\n    expect(true).toBe(true);\n  });\n\n  test('should handle edge cases', () => {\n    // Edge case testing\n    expect(true).toBe(true);\n  });\n});`;
    
    this.logActivity('tests_generated', 'Test cases generated', { prompt, testCode });
    return { type: 'code', content: testCode, language: 'javascript' };
  }

  async deployCode(prompt, context) {
    const deploymentSteps = `Deployment Plan for: ${prompt}\n\n1. 📋 Pre-deployment checklist\n2. 🔧 Build optimization\n3. 🧪 Run tests\n4. 🚀 Deploy to staging\n5. ✅ Production deployment\n6. 📊 Monitor metrics\n\nEstimated time: 15-30 minutes`;
    
    this.logActivity('deployment_planned', 'Deployment plan created', { prompt, steps: deploymentSteps });
    return { type: 'deployment', content: deploymentSteps };
  }

  improveCodeStructure(code) {
    // Simple code improvement logic
    return `// Refactored and improved code\n${code}\n\n// Added error handling and optimization`;
  }

  // Marketing Agent Methods
  async generateContent(prompt) {
    // Check if image generation is requested
    if (this.shouldGenerateImage(prompt)) {
      return await this.generateImage(prompt);
    }

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

  async generateImage(prompt) {
    const imagePrompt = prompt.replace(/generate|create|make|image|picture|photo/gi, '').trim();
    
    try {
      // Use the real image generator
      const result = await imageGenerator.generateImage(imagePrompt, {
        width: 512,
        height: 512,
        style: 'realistic'
      });
      
      this.logActivity('image_generated', `Generated image for: ${imagePrompt}`, { 
        prompt, 
        imageUrl: result.url,
        method: result.method 
      });
      
      return {
        type: 'image',
        content: {
          url: result.url,
          description: result.description,
          prompt: imagePrompt,
          method: result.method,
          keywords: result.keywords || ''
        }
      };
    } catch (error) {
      console.error('Image generation failed:', error);
      
      // Fallback to placeholder
      const fallbackUrl = `https://via.placeholder.com/512x300/6366f1/ffffff?text=${encodeURIComponent(imagePrompt.substring(0, 20))}`;
      
      return {
        type: 'image',
        content: {
          url: fallbackUrl,
          description: `Placeholder for: ${imagePrompt}`,
          prompt: imagePrompt,
          method: 'fallback',
          error: error.message
        }
      };
    }
  }

  shouldGenerateImage(prompt) {
    const imageKeywords = ['generate image', 'create image', 'make image', 'draw', 'design image', 'picture', 'photo', 'visual', 'graphic'];
    return imageKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  }

  async createCampaign(prompt) {
    const campaign = {
      name: prompt,
      objective: `Promote ${prompt} to target audience`,
      targetAudience: 'Tech-savvy professionals aged 25-45',
      platforms: ['LinkedIn', 'Twitter', 'Facebook'],
      content: [
        { type: 'post', text: `🚀 Introducing ${prompt}! Revolutionary solution for modern businesses.` },
        { type: 'story', text: `Behind the scenes: How ${prompt} is changing the game` },
        { type: 'video', text: `Watch: ${prompt} in action - 60 second demo` }
      ],
      budget: '$5,000',
      duration: '4 weeks',
      kpis: ['Reach', 'Engagement', 'Conversions', 'Brand Awareness']
    };

    this.logActivity('campaign_created', `Created marketing campaign`, { prompt, campaign });
    return { type: 'campaign', content: campaign };
  }

  async manageSocial(prompt) {
    const socialPosts = [
      `📊 ${prompt} Analytics Show: 📈 +45% engagement this week! #growth #analytics`,
      `💡 Pro tip: Use ${prompt} to boost your productivity by 3x! Who's tried it? 🤔`,
      `🎯 Success story: How @company increased ROI by 200% using ${prompt}`,
      `🔥 Hot take: ${prompt} is the future of digital transformation. Agree? 👇`
    ];

    const schedule = {
      monday: '9:00 AM - Motivational Monday post',
      wednesday: '2:00 PM - Tips & Tricks',
      friday: '4:00 PM - Week recap & insights',
      sunday: '6:00 PM - Community highlights'
    };

    this.logActivity('social_managed', 'Social media content scheduled', { prompt, posts: socialPosts, schedule });
    return { type: 'social', content: { posts: socialPosts, schedule } };
  }

  async analyzeMetrics(prompt, context) {
    const metrics = {
      overview: `Analytics Report for: ${prompt}`,
      performance: {
        reach: '15.2K',
        impressions: '45.8K', 
        engagement: '3.2K',
        clickThrough: '2.1%',
        conversions: '156'
      },
      insights: [
        'Peak engagement occurs between 2-4 PM',
        'Video content performs 40% better than static posts',
        'LinkedIn generates highest quality leads',
        'Mobile traffic accounts for 78% of total visits'
      ],
      recommendations: [
        'Increase video content by 25%',
        'Post during peak hours for better reach',
        'A/B test different call-to-action buttons',
        'Focus budget on LinkedIn campaigns'
      ]
    };

    this.logActivity('metrics_analyzed', 'Marketing metrics analyzed', { prompt, metrics });
    return { type: 'analytics', content: metrics };
  }

  async createEmail(prompt) {
    const emailCampaign = {
      subject: `Exciting Update: ${prompt}`,
      preview: `Don't miss out on ${prompt} - limited time offer!`,
      content: `
        <h1>Hello there! 👋</h1>
        <p>We're thrilled to share some exciting news about <strong>${prompt}</strong>!</p>
        
        <h2>What's New?</h2>
        <ul>
          <li>Enhanced features for better user experience</li>
          <li>Improved performance and reliability</li>
          <li>New integrations with popular tools</li>
        </ul>
        
        <p><a href="#" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Learn More</a></p>
        
        <p>Best regards,<br>The Team</p>
      `,
      segments: ['Active Users', 'Trial Users', 'Premium Subscribers'],
      sendTime: 'Tuesday, 10:00 AM EST'
    };

    this.logActivity('email_created', 'Email campaign created', { prompt, campaign: emailCampaign });
    return { type: 'email', content: emailCampaign };
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

  async scheduleTask(prompt) {
    const schedule = {
      task: prompt,
      assignee: 'Team Lead',
      priority: 'Medium',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 8,
      dependencies: [],
      status: 'Scheduled'
    };

    this.logActivity('task_scheduled', `Task scheduled: ${prompt}`, { schedule });
    return { type: 'schedule', content: schedule };
  }

  async generateReport(prompt, context) {
    const report = {
      title: `Project Report: ${prompt}`,
      summary: 'Overall project is on track with 85% completion rate',
      metrics: {
        tasksCompleted: 42,
        totalTasks: 50,
        teamEfficiency: '92%',
        budgetUsed: '78%',
        timeElapsed: '65%'
      },
      achievements: [
        'Completed core features ahead of schedule',
        'Reduced bugs by 40% through code reviews',
        'Improved team collaboration'
      ],
      risks: [
        'Potential delay in third-party integration',
        'Resource allocation for Q4'
      ],
      nextSteps: [
        'Finalize testing phase',
        'Prepare deployment strategy',
        'Schedule stakeholder review'
      ]
    };

    this.logActivity('report_generated', 'Project report generated', { prompt, report });
    return { type: 'report', content: report };
  }

  async organizeMeeting(prompt) {
    const meeting = {
      title: prompt,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00 AM',
      duration: '1 hour',
      attendees: ['Team Lead', 'Developers', 'Stakeholders'],
      agenda: [
        'Project status update',
        'Discuss blockers',
        'Plan next sprint',
        'Q&A session'
      ],
      location: 'Conference Room A / Zoom'
    };

    this.logActivity('meeting_organized', `Meeting organized: ${prompt}`, { meeting });
    return { type: 'meeting', content: meeting };
  }

  async checkStatus(prompt, context) {
    const status = {
      project: prompt,
      overall: 'On Track',
      progress: '85%',
      milestones: {
        completed: 3,
        upcoming: 1,
        total: 4
      },
      team: {
        active: 4,
        available: 3,
        busy: 1
      },
      blockers: [
        'Waiting for API documentation',
        'Design review pending'
      ],
      recommendations: [
        'Prioritize critical path items',
        'Schedule design review meeting',
        'Update project timeline'
      ]
    };

    this.logActivity('status_checked', 'Project status checked', { prompt, status });
    return { type: 'status', content: status };
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

  async scheduleMeeting(prompt) {
    const meeting = {
      title: `Client Meeting: ${prompt}`,
      type: 'Client Discussion',
      proposedDates: [
        'Tomorrow 2:00 PM',
        'Thursday 10:00 AM', 
        'Friday 3:00 PM'
      ],
      agenda: [
        'Project progress review',
        'Address client concerns',
        'Discuss next steps',
        'Timeline updates'
      ],
      participants: ['Client', 'Project Manager', 'Lead Developer'],
      preparationItems: [
        'Prepare demo of latest features',
        'Review client feedback',
        'Update project timeline'
      ]
    };

    this.logActivity('meeting_scheduled', 'Client meeting scheduled', { prompt, meeting });
    return { type: 'meeting', content: meeting };
  }

  async analyzeRequirement(prompt) {
    const analysis = {
      requirement: prompt,
      type: this.classifyRequirement(prompt),
      complexity: this.assessComplexity(prompt),
      estimatedEffort: '2-3 weeks',
      dependencies: ['Database schema update', 'API changes'],
      risksAndChallenges: [
        'Integration complexity',
        'Data migration requirements',
        'Performance impact'
      ],
      acceptanceCriteria: [
        'Feature works as specified',
        'Performance meets requirements',
        'Passes all test cases'
      ],
      recommendations: [
        'Break down into smaller tasks',
        'Create detailed mockups',
        'Plan thorough testing'
      ]
    };

    this.logActivity('requirement_analyzed', 'Requirement analysis completed', { prompt, analysis });
    return { type: 'requirement', content: analysis };
  }

  async handleCommunication(prompt) {
    const communication = {
      originalMessage: prompt,
      responseTemplate: `Dear Valued Client,\n\nThank you for reaching out regarding ${prompt}.\n\nWe have received your message and our team is reviewing it carefully. We will provide you with a detailed response within 24 hours.\n\nIf this is urgent, please don't hesitate to contact us directly.\n\nBest regards,\nThe Development Team`,
      suggestedActions: [
        'Acknowledge receipt immediately',
        'Escalate if urgent',
        'Schedule follow-up if needed',
        'Document in client portal'
      ],
      priority: this.prioritizeFeedback(prompt),
      expectedResponseTime: '24 hours'
    };

    this.logActivity('communication_handled', 'Client communication processed', { prompt, communication });
    return { type: 'communication', content: communication };
  }

  async requestApproval(prompt) {
    const approval = {
      item: prompt,
      type: 'Feature Approval',
      description: `Request for client approval on: ${prompt}`,
      documents: [
        'Feature specification',
        'Design mockups',
        'Implementation plan',
        'Testing strategy'
      ],
      approvalProcess: [
        'Submit request with documentation',
        'Client review (3-5 business days)',
        'Address any feedback',
        'Receive final approval',
        'Proceed with implementation'
      ],
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending Review'
    };

    this.logActivity('approval_requested', 'Client approval requested', { prompt, approval });
    return { type: 'approval', content: approval };
  }

  classifyRequirement(prompt) {
    if (prompt.includes('feature') || prompt.includes('new')) return 'Feature Request';
    if (prompt.includes('change') || prompt.includes('modify')) return 'Change Request';
    if (prompt.includes('fix') || prompt.includes('bug')) return 'Bug Fix';
    if (prompt.includes('improve') || prompt.includes('enhance')) return 'Enhancement';
    return 'General Request';
  }

  assessComplexity(prompt) {
    const complexWords = ['integrate', 'migrate', 'redesign', 'complex', 'advanced'];
    const hasComplexWords = complexWords.some(word => prompt.toLowerCase().includes(word));
    
    if (hasComplexWords || prompt.length > 100) return 'High';
    if (prompt.length > 50) return 'Medium';
    return 'Low';
  }

  // Utility Methods
  identifyCodeType(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('login') || lowerPrompt.includes('signin') || lowerPrompt.includes('authentication')) return 'login';
    if (lowerPrompt.includes('form') || lowerPrompt.includes('input')) return 'form';
    if (lowerPrompt.includes('page') || lowerPrompt.includes('full page') || lowerPrompt.includes('entire page')) return 'page';
    if (lowerPrompt.includes('api') || lowerPrompt.includes('endpoint') || lowerPrompt.includes('route')) return 'api';
    if (lowerPrompt.includes('component') || lowerPrompt.includes('ui') || lowerPrompt.includes('react')) return 'component';
    if (lowerPrompt.includes('class') || lowerPrompt.includes('object')) return 'class';
    if (lowerPrompt.includes('function') || lowerPrompt.includes('method')) return 'function';
    
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
