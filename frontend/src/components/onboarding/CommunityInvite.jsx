// src/components/onboarding/CommunityInvite.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const CommunityInvite = ({ userData, setUserData, onBack, onComplete }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleAddEmail = () => {
    if (!email) {
      setError('Please enter an email');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    if (userData.invitedEmails.includes(email)) {
      setError('Email already added');
      return;
    }

    setUserData({
      ...userData,
      invitedEmails: [...userData.invitedEmails, email]
    });
    setEmail('');
    setError('');
  };

  const handleDeleteEmail = (emailToDelete) => {
    setUserData({
      ...userData,
      invitedEmails: userData.invitedEmails.filter(e => e !== emailToDelete)
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Invite Friends & Family
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Track your carbon footprint together and compete for a greener future
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
          InputProps={{
            endAdornment: (
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddEmail}
                color="primary"
              >
                Add
              </Button>
            )
          }}
        />
      </Box>

      {userData.invitedEmails.length > 0 && (
        <Paper variant="outlined">
          <Box p={2}>
            <Typography variant="subtitle2" gutterBottom>
              Invited Members
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {userData.invitedEmails.map((email) => (
                <Chip
                  key={email}
                  label={email}
                  onDelete={() => handleDeleteEmail(email)}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      )}

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onComplete}
        >
          Complete Setup
        </Button>
      </Box>
    </Box>
  );
};

export default CommunityInvite;