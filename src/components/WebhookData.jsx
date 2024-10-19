import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WebhookData = () => {
  const [webhookData, setWebhookData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebhookData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/webhook');
        setWebhookData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWebhookData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Webhook Data</h1>
      <pre>{JSON.stringify(webhookData, null, 2)}</pre>
    </div>
  );
};

export default WebhookData;
