
import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { storageManager, STORAGE_KEYS } from '../utils/storage';
import { createAgentLog, AGENT_TYPES } from '../utils/agents';
import { Play, Save, FileText, GitCommit, Bug, Clock, Terminal, Eye, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { agentManager } from '../utils/aiAgents';

function CodeIDE() {
  const [code, setCode] = useState('// Welcome to CodeChrono IDE\n// Start coding and your activity will be automatically tracked\n\nfunction helloWorld() {\n  console.log("Hello, CodeChrono!");\n}\n\nhelloWorld();');
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('main.js');
  const [sessionStart, setSessionStart] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    linesWritten: 0,
    timeSpent: 0,
    commits: 0,
    bugsFixed: 0
  });
  const [isBugFixing, setIsBugFixing] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'info', message: 'Welcome to CodeChrono Terminal', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const terminalRef = useRef(null);

  useEffect(() => {
    setSessionStart(new Date());
    const savedCode = storageManager.get(STORAGE_KEYS.CODE_SESSIONS);
    if (savedCode && savedCode.length > 0) {
      const latestSession = savedCode[savedCode.length - 1];
      if (latestSession.code) {
        setCode(latestSession.code);
      }
    }

    // Listen for messages from AgentInterface
    const handleMessage = (event) => {
      if (event.data.type === 'SEND_TO_IDE') {
        setCode(event.data.code);
        setLanguage(event.data.language);
        addToTerminal('success', `Code received from agent and loaded into editor`);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (sessionStart) {
        logActivity('session_end', 'Coding session ended', {
          duration: Date.now() - sessionStart.getTime(),
          linesWritten: code.split('\n').length
        });
      }
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const logActivity = (activity, description, metadata = {}) => {
    const log = createAgentLog(AGENT_TYPES.DEV, activity, description, {
      fileName,
      language,
      sessionId: sessionStart?.getTime(),
      ...metadata
    });

    const logs = storageManager.get(STORAGE_KEYS.LOGS) || [];
    storageManager.set(STORAGE_KEYS.LOGS, [...logs, log]);
  };

  const addToTerminal = (type, message) => {
    setTerminalOutput(prev => [
      ...prev,
      { type, message, timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  const handleCodeChange = (value) => {
    setCode(value);
    updatePreview(value);

    if (value !== code) {
      setTimeout(() => {
        logActivity('code_edit', `Modified ${fileName}`, {
          linesOfCode: value.split('\n').length,
          characters: value.length
        });
      }, 10000);
    }
  };

  const updatePreview = (codeValue) => {
    if (language === 'html') {
      setPreviewContent(codeValue);
    } else if (language === 'javascript') {
      // Create a simple HTML wrapper for JS
      setPreviewContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .output { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .console { background: #1e1e1e; color: #00ff00; padding: 10px; border-radius: 4px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="output">
            <h3>JavaScript Output</h3>
            <div id="output"></div>
            <div class="console" id="console"></div>
          </div>
          <script>
            // Override console.log to display in preview
            const originalLog = console.log;
            const consoleDiv = document.getElementById('console');
            console.log = function(...args) {
              originalLog.apply(console, args);
              consoleDiv.innerHTML += args.join(' ') + '\\n';
            };
            
            try {
              ${codeValue}
            } catch (error) {
              document.getElementById('output').innerHTML = '<div style="color: red;">Error: ' + error.message + '</div>';
            }
          </script>
        </body>
        </html>
      `);
    } else if (language === 'css') {
      setPreviewContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CSS Preview</title>
          <style>
            ${codeValue}
          </style>
        </head>
        <body>
          <div class="preview-container">
            <h1>CSS Preview</h1>
            <p>This is a sample paragraph to show your CSS styles.</p>
            <button>Sample Button</button>
            <div class="box">Sample Box</div>
          </div>
        </body>
        </html>
      `);
    }
  };

  const executeTerminalCommand = (command) => {
    addToTerminal('command', `$ ${command}`);
    
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'clear') {
      setTerminalOutput([]);
      return;
    }
    
    if (cmd === 'help') {
      addToTerminal('info', 'Available commands: clear, help, run, ls, pwd, date, version');
      return;
    }
    
    if (cmd === 'run') {
      runCode();
      return;
    }
    
    if (cmd === 'ls') {
      addToTerminal('success', `${fileName} (${code.split('\n').length} lines)`);
      return;
    }
    
    if (cmd === 'pwd') {
      addToTerminal('success', '/workspace/codechrono-ide');
      return;
    }
    
    if (cmd === 'date') {
      addToTerminal('success', new Date().toString());
      return;
    }
    
    if (cmd === 'version') {
      addToTerminal('success', 'CodeChrono IDE v1.0.0');
      return;
    }
    
    // Simulate some JavaScript execution
    if (cmd.startsWith('node ') || cmd.includes('.js')) {
      addToTerminal('info', 'Executing JavaScript...');
      try {
        eval(code);
        addToTerminal('success', 'Code executed successfully');
      } catch (error) {
        addToTerminal('error', `Error: ${error.message}`);
      }
      return;
    }
    
    addToTerminal('error', `Command not found: ${command}`);
  };

  const handleTerminalKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (terminalInput.trim()) {
        executeTerminalCommand(terminalInput);
        setTerminalInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Add command history functionality later
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Add autocomplete functionality later
    }
  };

  const saveCode = () => {
    const session = {
      id: Date.now(),
      fileName,
      language,
      code,
      timestamp: new Date().toISOString(),
      sessionStart: sessionStart?.toISOString()
    };

    storageManager.addToArray(STORAGE_KEYS.CODE_SESSIONS, session);
    logActivity('file_save', `Saved ${fileName}`, {
      fileSize: code.length,
      linesOfCode: code.split('\n').length
    });

    addToTerminal('success', `File ${fileName} saved successfully`);
  };

  const commitCode = () => {
    const commitMessage = prompt('Enter commit message:');
    if (commitMessage) {
      logActivity('commit', `Committed: ${commitMessage}`, {
        fileName,
        commitMessage,
        linesOfCode: code.split('\n').length
      });

      setSessionStats(prev => ({ ...prev, commits: prev.commits + 1 }));
      addToTerminal('success', `Committed: ${commitMessage}`);
    }
  };

  const reportBug = () => {
    const bugDescription = prompt('Describe the bug:');
    if (bugDescription) {
      logActivity('bug_report', `Bug reported: ${bugDescription}`, {
        fileName,
        bugDescription,
        lineNumber: 1
      });
      addToTerminal('warning', `Bug reported: ${bugDescription}`);
    }
  };

  const fixBug = async () => {
    if (!code.trim()) {
      addToTerminal('error', 'No code to debug!');
      return;
    }

    setIsBugFixing(true);
    addToTerminal('info', 'Starting bug analysis...');

    try {
      // Enhanced bug fixing with better analysis
      const response = await agentManager.sendPromptToAgent('dev', `Analyze and fix bugs in this ${language} code: ${code}`, { 
        language: language,
        context: 'IDE debugging'
      });

      if (response.type === 'debug') {
        addToTerminal('warning', 'Issues found:');
        addToTerminal('info', response.content);
      } else if (response.type === 'code') {
        const shouldReplace = window.confirm('Agent found issues and generated fixed code. Replace current code?');
        if (shouldReplace) {
          setCode(response.content);
          addToTerminal('success', 'Code has been fixed and updated!');
          setSessionStats(prev => ({ ...prev, bugsFixed: prev.bugsFixed + 1 }));
        }
      }
    } catch (error) {
      addToTerminal('error', `Bug fix failed: ${error.message}`);
    }

    setIsBugFixing(false);
  };

  const runCode = () => {
    addToTerminal('info', `Running ${fileName}...`);
    logActivity('code_run', `Executed ${fileName}`, {
      language,
      linesOfCode: code.split('\n').length
    });

    try {
      if (language === 'javascript') {
        // Capture console.log output
        const originalLog = console.log;
        const outputs = [];
        
        console.log = (...args) => {
          outputs.push(args.join(' '));
          originalLog(...args);
        };

        eval(code);
        
        console.log = originalLog;
        
        if (outputs.length > 0) {
          addToTerminal('success', 'Output:');
          outputs.forEach(output => addToTerminal('info', output));
        } else {
          addToTerminal('success', 'Code executed successfully (no output)');
        }
      } else {
        addToTerminal('info', `${language} execution simulation completed`);
      }
    } catch (error) {
      addToTerminal('error', `Runtime error: ${error.message}`);
      logActivity('runtime_error', `Runtime error in ${fileName}`, {
        error: error.message
      });
    }
  };

  return (
    <div className={`h-screen flex flex-col ${isMaximized ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText size={20} />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 text-sm"
                placeholder="Enter filename"
              />
            </div>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                updatePreview(code);
              }}
              className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm"
            >
              <option value="javascript" className="text-black">JavaScript</option>
              <option value="html" className="text-black">HTML</option>
              <option value="css" className="text-black">CSS</option>
              <option value="python" className="text-black">Python</option>
              <option value="json" className="text-black">JSON</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runCode}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors shadow-lg"
            >
              <Play size={16} />
              Run
            </button>
            <button
              onClick={saveCode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors shadow-lg"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showTerminal ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              <Terminal size={16} />
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showPreview ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
            >
              {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="flex items-center gap-6 mt-3 text-sm text-white/80">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            Session: {sessionStart ? Math.floor((Date.now() - sessionStart.getTime()) / 60000) : 0}min
          </div>
          <div>Lines: {code.split('\n').length}</div>
          <div>Characters: {code.length}</div>
          <div>Commits: {sessionStats.commits}</div>
          <div>Bugs Fixed: {sessionStats.bugsFixed}</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Editor Panel */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                folding: true,
                bracketMatching: 'always'
              }}
            />
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 border-l border-gray-200 bg-white">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
            </div>
            <div className="h-full">
              {language === 'html' || language === 'javascript' || language === 'css' ? (
                <iframe
                  srcDoc={previewContent}
                  className="w-full h-full border-0"
                  title="Code Preview"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="p-4 text-gray-500 text-center">
                  Preview not available for {language}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Terminal */}
      {showTerminal && (
        <div className="h-64 border-t border-gray-200 bg-gray-900 text-green-400 font-mono">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Terminal</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={commitCode}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
              >
                <GitCommit size={12} />
                Commit
              </button>
              <button
                onClick={reportBug}
                className="flex items-center gap-1 px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs"
              >
                <Bug size={12} />
                Report
              </button>
              <button
                onClick={fixBug}
                disabled={isBugFixing}
                className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded text-xs"
              >
                <Bug size={12} />
                {isBugFixing ? 'Fixing...' : 'Fix Bugs'}
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col h-full">
            <div 
              ref={terminalRef}
              className="flex-1 p-4 overflow-y-auto space-y-1 text-sm"
            >
              {terminalOutput.map((line, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-gray-500 text-xs">{line.timestamp}</span>
                  <span className={`
                    ${line.type === 'error' ? 'text-red-400' : ''}
                    ${line.type === 'success' ? 'text-green-400' : ''}
                    ${line.type === 'warning' ? 'text-yellow-400' : ''}
                    ${line.type === 'info' ? 'text-blue-400' : ''}
                    ${line.type === 'command' ? 'text-white' : ''}
                  `}>
                    {line.message}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 p-2 flex items-center gap-2">
              <span className="text-green-400">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalKeyPress}
                placeholder="Type command and press Enter (try: help, run, clear)"
                className="flex-1 bg-transparent text-green-400 outline-none placeholder-gray-500 border-none focus:ring-0"
                autoFocus
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeIDE;
