import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Item {
  id: string;
  name: string;
}

const Dashboard: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    try {
      // Replace with your deployed backend API URL or use a proxy in development
      const response = await axios.get('/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Button variant="contained" onClick={fetchItems}>
        Refresh Items
      </Button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} (ID: {item.id})
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default Dashboard;
