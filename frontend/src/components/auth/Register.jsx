import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, MenuItem, Paper } from '@mui/material';
import api from '../../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    travelMode: 'car',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Create Account
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography variant="body2" color="success" sx={{ marginBottom: 2 }}>
            Registration successful! Please log in.
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="travelMode"
            select
            label="Travel Mode"
            value={formData.travelMode}
            onChange={(e) => setFormData({ ...formData, travelMode: e.target.value })}
            helperText="Select your primary travel mode"
          >
            <MenuItem value="car">Car</MenuItem>
            <MenuItem value="bike">Bike</MenuItem>
            <MenuItem value="public_transport">Public Transport</MenuItem>
            <MenuItem value="walk">Walk</MenuItem>
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
