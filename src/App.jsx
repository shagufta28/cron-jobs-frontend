import React from 'react';
import { Container } from '@mui/material';
import CronJobList from './components/CronJobList';

const App = () => {
  return (
    <Container>     
      <CronJobList />
    </Container>
  );
};

export default App;
