import { Clock, Trash2 } from 'lucide-react';
import apiClient from '../api/apiClient';
import './sidebar.css';

const Sidebar = ({ history, onSelect }) => {
  const methodColors = {
    GET: '#4ade80',
    POST: '#fbbf24',
    PUT: '#60a5fa',
    DELETE: '#f87171',
    PATCH: '#c084fc'
  };

  const statusColors = (status) => {
    if (!status) return '#94a3b8';
    if (status >= 200 && status < 300) return '#4ade80';
    if (status >= 300 && status < 400) return '#fbbf24';
    if (status >= 400) return '#f87171';
    return '#94a3b8';
  };

  const handleClear = async () => {
    if (window.confirm('Clear all history?')) {
      await apiClient.delete('/history');
      window.location.reload();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Clock size={16} />
          <span>History</span>
        </div>
        <button className="clear-btn" onClick={handleClear} title="Clear History">
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="history-list">
        {history.length === 0 ? (
          <div className="empty-state">No history yet</div>
        ) : (
          history.map((item) => (
            <div 
              key={item._id} 
              className="history-item"
              onClick={() => onSelect(item)}
            >
              <div className="history-item-header">
                <span className="method" style={{ color: methodColors[item.method] || '#fff' }}>
                  {item.method}
                </span>
                {item.status && (
                  <span className="status" style={{ color: statusColors(item.status) }}>
                    {item.status}
                  </span>
                )}
              </div>
              <div className="url" title={item.url}>{item.url}</div>
              <div className="time-ago">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
