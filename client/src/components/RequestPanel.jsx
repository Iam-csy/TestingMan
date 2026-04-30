import { useState } from 'react';
import { Send, Plus, Trash2 } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import './panels.css';

const RequestPanel = ({ activeRequest, setActiveRequest, onSend, loading }) => {
  const [activeTab, setActiveTab] = useState('params');
  
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];

  const handleUrlChange = (e) => {
    setActiveRequest({ ...activeRequest, url: e.target.value });
  };

  const handleMethodChange = (e) => {
    setActiveRequest({ ...activeRequest, method: e.target.value });
  };

  const handleAddHeader = () => {
    setActiveRequest({
      ...activeRequest,
      headers: [...activeRequest.headers, { key: '', value: '' }]
    });
  };

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...activeRequest.headers];
    newHeaders[index][field] = value;
    setActiveRequest({ ...activeRequest, headers: newHeaders });
  };

  const handleRemoveHeader = (index) => {
    const newHeaders = [...activeRequest.headers];
    newHeaders.splice(index, 1);
    setActiveRequest({ ...activeRequest, headers: newHeaders });
  };

  const handleBodyChange = (value) => {
    setActiveRequest({ ...activeRequest, body: value });
  };

  return (
    <div className="panel request-panel">
      <div className="request-bar">
        <select 
          className="method-select" 
          value={activeRequest.method} 
          onChange={handleMethodChange}
        >
          {methods.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input 
          type="text" 
          className="url-input" 
          placeholder="Enter request URL" 
          value={activeRequest.url}
          onChange={handleUrlChange}
        />
        <button 
          className="send-btn" 
          onClick={() => onSend(activeRequest)}
          disabled={loading || !activeRequest.url}
        >
          {loading ? 'Sending...' : <><Send size={16} /> Send</>}
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'params' ? 'active' : ''}`}
          onClick={() => setActiveTab('params')}
        >
          Params
        </button>
        <button 
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers ({activeRequest.headers?.filter(h => h.key).length || 0})
        </button>
        <button 
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'params' && (
          <div className="empty-tab-state">Query parameters are extracted from the URL.</div>
        )}

        {activeTab === 'headers' && (
          <div className="key-value-editor">
            {activeRequest.headers?.map((header, index) => (
              <div key={index} className="kv-row">
                <input 
                  type="text" 
                  placeholder="Key" 
                  value={header.key}
                  onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Value" 
                  value={header.value}
                  onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                />
                <button onClick={() => handleRemoveHeader(index)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button className="add-kv-btn" onClick={handleAddHeader}>
              <Plus size={16} /> Add Header
            </button>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="code-editor-wrapper">
            <CodeMirror
              value={activeRequest.body || ''}
              height="200px"
              theme={oneDark}
              extensions={[json()]}
              onChange={handleBodyChange}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPanel;
