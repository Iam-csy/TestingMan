import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import Sidebar from '../components/Sidebar';
import RequestPanel from '../components/RequestPanel';
import ResponsePanel from '../components/ResponsePanel';
import './home.css';

const Home = () => {
  const [history, setHistory] = useState([]);
  const [activeRequest, setActiveRequest] = useState({
    url: '',
    method: 'GET',
    headers: [],
    body: ''
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/history');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSendRequest = async (requestData) => {
    setLoading(true);
    setResponse(null);
    try {
      // Transform headers array to object
      const headersObj = {};
      requestData.headers.forEach(h => {
        if (h.key && h.value) headersObj[h.key] = h.value;
      });

      const payload = {
        url: requestData.url,
        method: requestData.method,
        headers: headersObj,
      };

      if (requestData.method !== 'GET' && requestData.body) {
        try {
          payload.body = JSON.parse(requestData.body);
        } catch (e) {
          payload.body = requestData.body; // fallback to string
        }
      }

      const res = await apiClient.post('/request/test', payload);
      setResponse(res.data);

      // Save to history
      if (res.data.success) {
        await apiClient.post('/history', {
          url: requestData.url,
          method: requestData.method,
          status: res.data.status,
          time: res.data.time
        });
        fetchHistory();
      }

    } catch (error) {
      setResponse({
        success: false,
        status: error.response?.status || 500,
        statusText: error.response?.statusText || 'Error',
        time: 0,
        size: 0,
        data: error.response?.data || error.message,
        headers: error.response?.headers || {}
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item) => {
    setActiveRequest({
      url: item.url,
      method: item.method,
      headers: [],
      body: ''
    });
  };

  return (
    <div className="home-container">
      <Sidebar history={history} onSelect={handleSelectHistory} />
      <div className="workspace">
        <RequestPanel 
          activeRequest={activeRequest} 
          setActiveRequest={setActiveRequest} 
          onSend={handleSendRequest}
          loading={loading}
        />
        <ResponsePanel response={response} loading={loading} />
      </div>
    </div>
  );
};

export default Home;
