import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { useState } from 'react';
import './panels.css';

const ResponsePanel = ({ response, loading }) => {
  const [activeTab, setActiveTab] = useState('body');

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#4ade80';
    if (status >= 300 && status < 400) return '#fbbf24';
    if (status >= 400) return '#f87171';
    return '#fff';
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="panel response-panel loading-state">
        <div className="loader"></div>
        <p>Sending request...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="panel response-panel empty-state">
        Enter a URL and click Send to get a response
      </div>
    );
  }

  const formattedJson = typeof response.data === 'object' 
    ? JSON.stringify(response.data, null, 2)
    : String(response.data);

  const headerKeys = Object.keys(response.headers || {});

  return (
    <div className="panel response-panel">
      <div className="response-meta">
        <div className="meta-item">
          Status: <span style={{ color: getStatusColor(response.status) }}>
            {response.status} {response.statusText}
          </span>
        </div>
        <div className="meta-item">
          Time: <span style={{ color: '#60a5fa' }}>{response.time} ms</span>
        </div>
        <div className="meta-item">
          Size: <span style={{ color: '#c084fc' }}>{formatSize(response.size || 0)}</span>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </button>
        <button 
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers ({headerKeys.length})
        </button>
      </div>

      <div className="tab-content response-content">
        {activeTab === 'body' && (
          <div className="code-editor-wrapper">
             <CodeMirror
              value={formattedJson}
              height="350px"
              theme={oneDark}
              extensions={[json()]}
              readOnly={true}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
              }}
            />
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="response-headers">
            {headerKeys.length === 0 ? (
              <div className="empty-tab-state">No headers</div>
            ) : (
              <table className="headers-table">
                <tbody>
                  {headerKeys.map(key => (
                    <tr key={key}>
                      <td className="header-key">{key}</td>
                      <td className="header-value">{response.headers[key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsePanel;
