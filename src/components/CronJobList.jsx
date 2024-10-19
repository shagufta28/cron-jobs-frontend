import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
  Grid,
  Dialog,
} from '@mui/material';
import { Edit, Delete, Visibility, AddCircleOutline } from '@mui/icons-material';
import axios from 'axios';
import CronJobForm from './CronJobForm';
import WebhookData from './WebhookData';

const CronJobList = () => {
  const [cronJobs, setCronJobs] = useState([]);
  const [filter, setFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    fetchCronJobs();
  }, []);

  const fetchCronJobs = async () => {
    try {
      const response = await axios.get('https://cron-jobs-dyuy.onrender.com/cron-jobs');
      setCronJobs(response.data);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error('Error fetching cron jobs:', error);
      setError('Cannot fetch the cron jobs. Please try again later.'); // Set error message
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleCreateJob = () => {
    setSelectedJob(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(`https://cron-jobs-dyuy.onrender.com/cron-jobs/${id}`);
      fetchCronJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Cannot delete the job. Please try again later.'); // Set error message for delete
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleJobCreated = () => {
    fetchCronJobs();
  };

  const handleWebhookDialogOpen = () => {
    setIsWebhookDialogOpen(true);
  };

  const handleWebhookDialogClose = () => {
    setIsWebhookDialogOpen(false);
  };

  // Filter cronJobs based on the filter input
  const filteredCronJobs = cronJobs.filter((job) =>
    job.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      paddingTop: '100px' // Add padding for a cleaner look
    }}>
      <Typography variant="h4" gutterBottom style={{ 
        color: '#4a4a4a', 
        fontWeight: 'bold', 
        marginBottom: '24px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif' // Change font family
      }}>
        Cron Jobs Management
      </Typography>

      <Grid container spacing={2} style={{ marginBottom: '16px', marginTop: '50px' }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Filter by Job Name" // Updated label
            variant="outlined"
            fullWidth
            value={filter}
            onChange={handleFilterChange}
            style={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' // Add shadow for depth
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<AddCircleOutline />}
            onClick={handleCreateJob}
            style={{ 
              height: '56px', 
              borderRadius: '8px', 
              backgroundColor: '#6bbf9f' // Pastel green
            }}
          >
            Create Job
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleWebhookDialogOpen}
            style={{ 
              height: '56px', 
              borderRadius: '8px', 
              backgroundColor: '#ff6f61' // Pastel coral
            }}
          >
            See Webhook Data
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ borderRadius: '12px', overflow: 'hidden', marginTop: '50px' }}>
        {error ? ( // Conditional rendering for error message
          <Typography variant="body1" color="error" style={{ padding: '16px', textAlign: 'center' }}>
            {error}
          </Typography>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <TableHead style={{ backgroundColor: '#4a90e2', color: '#fff' }}>
                <TableRow>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Id</TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Trigger URL</TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Schedule</TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Start Date</TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCronJobs.map((job, index) => ( // Use filteredCronJobs instead of cronJobs
                  <TableRow key={job._id} style={{ backgroundColor: index % 2 === 0 ? '#e9f1f5' : '#ffffff' }}>
                    <TableCell>{job._id}</TableCell>
                    <TableCell>{job.name}</TableCell>
                    <TableCell>{job.triggerUrl}</TableCell>
                    <TableCell>{job.schedule}</TableCell>
                    <TableCell>{new Date(job.startDate).toISOString().split('T')[0]}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleViewJob(job)}>
                        <Visibility style={{ color: '#aaaaaa' }} />
                      </IconButton>
                      <IconButton color="primary" onClick={() => handleEditJob(job)}>
                        <Edit style={{ color: '#3c785c' }} />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDeleteJob(job._id)}>
                        <Delete style={{ color: '#fb3939' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TableContainer>

      {/* Cron Job Form Dialog */}
      <CronJobForm
        open={isDialogOpen}
        onClose={handleDialogClose}
        onJobCreated={handleJobCreated}
        job={selectedJob}
        mode={dialogMode}
      />

      {/* Webhook Data Dialog */}
      <Dialog open={isWebhookDialogOpen} onClose={handleWebhookDialogClose} maxWidth="md" fullWidth>
        <WebhookData />
        <Button onClick={handleWebhookDialogClose} color="primary" variant="contained" style={{ margin: '16px' }}>
          Close
        </Button>
      </Dialog>
    </div>
  );
};

export default CronJobList;
