import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import axios from 'axios';

const CronJobForm = ({ open, onClose, onJobCreated, job, mode }) => {
  const [jobName, setJobName] = useState('');
  const [triggerUrl, setTriggerUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [schedule, setSchedule] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (job && (mode === 'edit' || mode === 'view')) {
      setJobName(job.name);
      setTriggerUrl(job.triggerUrl);
      setApiKey(job.apiKey);
      setSchedule(job.schedule);
      setStartDate(job.startDate);
    } else if (mode === 'create') {
      // Clear form when creating a new job
      setJobName('');
      setTriggerUrl('');
      setApiKey('');
      setSchedule('');
      setStartDate(new Date().toISOString().split('T')[0]);
    }
  }, [job, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!jobName || !triggerUrl || !apiKey || !schedule || !startDate) {
      alert('Please fill all fields');
      return;
    }

    try {
      if (mode === 'create') {
        const response = await axios.post('http://localhost:5000/cron-jobs', {
          name: jobName,
          triggerUrl,
          apiKey,
          schedule,
          startDate,
        });
        console.log('Job created:', response.data);
      } else if (mode === 'edit') {
        const response = await axios.put(`http://localhost:5000/cron-jobs/${job._id}`, {
          name: jobName,
          triggerUrl,
          apiKey,
          schedule,
          startDate,
        });
        console.log('Job updated:', response.data);
      }
      onJobCreated(); // Trigger the callback to update the job list
      onClose();      // Close the dialog
    } catch (error) {
      console.error('Error creating or updating job:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === 'create' ? 'Add New Cron Job' : mode === 'edit' ? 'Edit Cron Job' : 'View Cron Job'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Job Name"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
          />
          <TextField
            label="Trigger URL"
            value={triggerUrl}
            onChange={(e) => setTriggerUrl(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
          />
          <TextField
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
          />
          <TextField
            label="Schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
          />

          {mode !== 'view' && (
            <Button type="submit" color="primary" variant="contained" fullWidth>
              {mode === 'create' ? 'Create Job' : 'Update Job'}
            </Button>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CronJobForm;
