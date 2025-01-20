import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import {  Link, useNavigate } from 'react-router-dom'; // Updated import
import api from '../../utils/api';

const Login = ({onLogin}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      onLogin(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
          
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link to="/onboarding" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
