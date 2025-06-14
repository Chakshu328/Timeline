import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Download, Play, Save } from 'lucide-react';

function AgentCodeEditor({ code, language = 'javascript', onSave, onRun, onAutoRun }) {
  const [editorCode, setEditorCode] = useState(code);

  useEffect(() => {
    setEditorCode(code);
    // Auto-execute if onAutoRun is provided
    if (onAutoRun && language === 'javascript') {
      setTimeout(() => onAutoRun(code), 500);
    }
  }, [code]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorCode);
    // Show better notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = '✅ Code copied to clipboard!';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([editorCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-generated-code.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunCode = () => {
    if (onRun) {
      onRun(editorCode);
    } else if (language === 'javascript') {
      try {
        console.log('🚀 Running agent-generated code:');
        const result = eval(editorCode);
        console.log('✅ Code executed successfully');
        if (result !== undefined) {
          console.log('Result:', result);
        }
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = '✅ Code executed successfully!';
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
      } catch (error) {
        console.error('❌ Code execution error:', error);
        
        // Show error notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = `❌ Error: ${error.message}`;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 5000);
      }
    }
  };

  const handleSaveCode = () => {
    if (onSave) {
      onSave(editorCode);
    } else {
      // Save to local storage or trigger download
      localStorage.setItem('agent_generated_code', editorCode);
      
      // Show save notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = '💾 Code saved locally!';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Agent Generated Code ({language})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            title="Copy Code"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={handleDownloadCode}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            title="Download Code"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleRunCode}
            className="p-1 text-green-600 hover:text-green-700"
            title="Run Code"
          >
            <Play size={16} />
          </button>
          <button
            onClick={handleSaveCode}
            className="p-1 text-blue-600 hover:text-blue-700"
            title="Save Code"
          >
            <Save size={16} />
          </button>
        </div>
      </div>
      <div className="h-64">
        <Editor
          height="100%"
          language={language}
          value={editorCode}
          onChange={(value) => setEditorCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: 'on'
          }}
        />
      </div>
    </div>
  );
}

export default AgentCodeEditor;