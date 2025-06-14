import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { storageManager, STORAGE_KEYS } from '../utils/storage';
import { createAgentLog, AGENT_TYPES } from '../utils/agents';
import { Play, Save, FileText, GitCommit, Bug, Clock } from 'lucide-react';

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

  useEffect(() => {
    // Start coding session
    setSessionStart(new Date());
    
    // Load saved code if exists
    const savedCode = storageManager.get(STORAGE_KEYS.CODE_SESSIONS);
    if (savedCode && savedCode.length > 0) {
      const latestSession = savedCode[savedCode.length - 1];
      if (latestSession.code) {
        setCode(latestSession.code);
      }
    }

    return () => {
      // Log session end
      if (sessionStart) {
        logActivity('session_end', 'Coding session ended', {
          duration: Date.now() - sessionStart.getTime(),
          linesWritten: code.split('\n').length
        });
      }
    };
  }, []);

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

  const handleCodeChange = (value) => {
    setCode(value);
    
    // Track code changes every 10 seconds
    if (value !== code) {
      setTimeout(() => {
        logActivity('code_edit', `Modified ${fileName}`, {
          linesOfCode: value.split('\n').length,
          characters: value.length
        });
      }, 10000);
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
    
    alert('Code saved successfully!');
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
      alert('Code committed successfully!');
    }
  };

  const reportBug = () => {
    const bugDescription = prompt('Describe the bug:');
    if (bugDescription) {
      logActivity('bug_report', `Bug reported: ${bugDescription}`, {
        fileName,
        bugDescription,
        lineNumber: 1 // Could be enhanced to get cursor position
      });
      alert('Bug reported successfully!');
    }
  };

  const fixBug = () => {
    const bugDescription = prompt('Describe the bug fix:');
    if (bugDescription) {
      logActivity('bug_fix', `Bug fixed: ${bugDescription}`, {
        fileName,
        fixDescription: bugDescription
      });
      
      setSessionStats(prev => ({ ...prev, bugsFixed: prev.bugsFixed + 1 }));
      alert('Bug fix logged successfully!');
    }
  };

  const runCode = () => {
    logActivity('code_run', `Executed ${fileName}`, {
      language,
      linesOfCode: code.split('\n').length
    });
    
    // Simple console simulation for demo
    if (language === 'javascript') {
      try {
        // Note: In a real IDE, you'd use a safer code execution method
        console.log('Code execution logged (check browser console for output)');
        eval(code);
      } catch (error) {
        console.error('Code execution error:', error);
        logActivity('runtime_error', `Runtime error in ${fileName}`, {
          error: error.message
        });
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* IDE Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-gray-600" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runCode}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <Play size={16} />
              Run
            </button>
            <button
              onClick={saveCode}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={commitCode}
              className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
            >
              <GitCommit size={16} />
              Commit
            </button>
            <button
              onClick={reportBug}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              <Bug size={16} />
              Report Bug
            </button>
            <button
              onClick={fixBug}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <Bug size={16} />
              Fix Bug
            </button>
          </div>
        </div>

        {/* Session Stats */}
        <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            Session: {sessionStart ? Math.floor((Date.now() - sessionStart.getTime()) / 60000) : 0}min
          </div>
          <div>Lines: {code.split('\n').length}</div>
          <div>Commits: {sessionStats.commits}</div>
          <div>Bugs Fixed: {sessionStats.bugsFixed}</div>
        </div>
      </div>

      {/* Code Editor */}
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
            }
          }}
        />
      </div>
    </div>
  );
}

export default CodeIDE;
