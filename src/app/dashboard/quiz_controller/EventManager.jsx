'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import EventCard from '@/components/ui/EventCard';

export default function EventManager() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null); // For editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageUrl: '',
    tags: '',
    onDuty: false,
  });

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOpenForm = (event = null) => {
    if (event) {
      setCurrentEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        time: event.time,
        location: event.location,
        imageUrl: event.imageUrl || '',
        tags: event.tags ? event.tags.join(', ') : '',
        onDuty: event.onDuty,
      });
    } else {
      setCurrentEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        imageUrl: '',
        tags: '',
        onDuty: false,
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      imageUrl: '',
      tags: '',
      onDuty: false,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const method = currentEvent ? 'PUT' : 'POST';
      const url = currentEvent ? `/api/events/${currentEvent._id}` : '/api/events';
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        date: new Date(formData.date),
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchEvents();
      handleCloseForm();
    } catch (err) {
      console.error('Error saving event:', err);
      setError(`Failed to ${currentEvent ? 'update' : 'create'} event.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ p: 8, textAlign: 'center', color: 'white' }}>
        <Typography variant="h6">🔄 Loading session...</Typography>
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Box sx={{ p: 8, textAlign: 'center', color: 'white' }}>
        <Typography variant="h6">🚫 Access Denied. Please log in.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Event Manager
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenForm()} sx={{ mb: 3 }}>
        Create New Event
      </Button>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <EventCard event={event} onClick={() => handleOpenForm(event)} />
            <Button size="small" color="error" onClick={() => handleDelete(event._id)} sx={{ mt: 1 }}>
              Delete
            </Button>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{currentEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Tags (comma-separated)"
              name="tags"
              value={formData.tags}
              onChange={handleFormChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.onDuty}
                  onChange={handleFormChange}
                  name="onDuty"
                  color="primary"
                />
              }
              label="On Duty"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {currentEvent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
