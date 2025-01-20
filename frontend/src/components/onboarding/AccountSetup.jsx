import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import { Facebook } from '@mui/icons-material';

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
  >
    <path d="M21.35 11.1h-9.34v2.84h5.61c-.56 2.07-2.34 3.57-4.38 3.57-2.66 0-4.82-2.16-4.82-4.82s2.16-4.82 4.82-4.82c1.16 0 2.23.41 3.06 1.08l2.11-2.11c-1.38-1.27-3.18-2.05-5.17-2.05-4.38 0-7.95 3.57-7.95 7.95s3.57 7.95 7.95 7.95c4.05 0 7.73-2.93 7.73-7.95 0-.53-.06-1.05-.17-1.55z" />
  </svg>
);

const AccountSetup = ({ userData, setUserData, onNext }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!userData.email) newErrors.email = 'Email is required';
    if (!userData.password) newErrors.password = 'Password is required';
    if (!userData.username) newErrors.username = 'Username is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Update userData and proceed to the next step
        localStorage.setItem('username',userData.username)
        onNext();
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Create Your Account
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={userData.username}
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          error={!!errors.username}
          helperText={errors.username}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          error={!!errors.password}
          helperText={errors.password}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          style={{ marginTop: 20 }}
        >
          Continue
        </Button>
      </form>


    </Box>
  );
};

export default AccountSetup;
