import React, { useState } from 'react';
import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';
import api from '../../utils/api';
import axios from 'axios';

const CommuteTracker = ({ onFinishCommute }) => {
  const [activeCommute, setActiveCommute] = useState(null);
  const [activeCommutevalue, setActiveCommutevalue] = useState(false); // Track if commute is active
  const [travelMode, setTravelMode] = useState('');
  const [carType, setCarType] = useState('');
  const [bikeType, setBikeType] = useState('');
  const [publicTransportType, setpublicTransportType] = useState('');
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [manualDistance, setManualDistance] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [userStartCoordinates, setUserStartCoordinates] = useState({ lat: null, lng: null });
  const [endCoordinates, setEndCoordinates] = useState({ lat: null, lng: null });
  const [startTime, setStartTime] = useState(null);

  const carTypes = [
    'SmallDieselCar', 'MediumDieselCar', 'LargeDieselCar',
    'MediumHybridCar', 'LargeHybridCar', 'MediumLPGCar',
    'LargeLPGCar', 'MediumCNGCar', 'LargeCNGCar',
    'SmallPetrolVan', 'LargePetrolVan', 'SmallDielselVan',
    'MediumDielselVan', 'LargeDielselVan', 'LPGVan',
    'CNGVan', 'SmallPetrolCar', 'MediumPetrolCar',
    'LargePetrolCar', 'SmallMotorBike', 'MediumMotorBike',
    'LargeMotorBike'
  ];
  const bikeTypes = [
    'SmallMotorBike', 'MediumMotorBike', 'LargeMotorBike'

  ];
  const publicTransports = [
    'Taxi', 'ClassicBus', 'EcoBus', 'Coach', 
    'NationalTrain', 'LightRail', 'Subway', 
    'FerryOnFoot', 'FerryInCar'

  ];

  const startCommute = async () => {
    try {
      const token = localStorage.getItem('token');
      // Determine the mode dynamically based on travelMode
      let mode;
      if (travelMode === 'Car') {
        mode = carType; // Use car type for Car mode
      } else if (travelMode === 'Bike') {
        mode = bikeType; // Use bike type for Bike mode
      } else if (travelMode === 'PublicTransport') {
        mode = publicTransportType; // Use public transport type for Public Transport mode
      } else {
        mode = travelMode; // Fallback to the generic travel mode
      }
  
      // API call to start commute
      const res = await api.post('/commute/start', {
        mode,
        travelMode, // Include main travel mode as well
        token,
      });
      setActiveCommute(res.data.commute_id);
      setStartTime(new Date());
      setActiveCommutevalue(true);
      console.log("Commute started");

      // Set user start coordinates using GPS
      if (gpsEnabled) {
        navigator.geolocation.getCurrentPosition((position) => {
          setUserStartCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
    } catch (err) {
      console.error('Error starting commute:', err);
    }
  };

  const stopCommuteWithGPS = async () => {
    try {
      // if (!activeCommute) return;

      // Set end coordinates using GPS
      if (gpsEnabled) {
        navigator.geolocation.getCurrentPosition((position) => {
          setEndCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
      // Calculate distances for the user
    const userDistance = calculateDistance(userStartCoordinates, endCoordinates);

    // Prepare data payload dynamically based on travelMode
    let payload = {
      travelMode, // Include the main travel mode (Car, Bike, PublicTransport)
      commuteId: activeCommute,
      user: {
        distance: userDistance,
        duration: calculateDuration(),
      },
    };

    // Add specific type and passengers for Car mode
    if (travelMode === "Car") {
      const passengerDistances = passengers.map((passenger) =>
        calculateDistance(passenger.coordinates, endCoordinates)
      );

      payload.carType = carType; // Include car type
      payload.passengers = passengers.map((passenger, index) => ({
        email: passenger.email,
        distance: passengerDistances[index],
        duration: calculateDuration(),
      }));
    } else if (travelMode === "Bike") {
      payload.bikeType = bikeType; // Include bike type
    } else if (travelMode === "PublicTransport") {
      payload.publicTransportType = publicTransportType; // Include public transport type
    }


      // Send API request to stop commute
    await api.post('/commute/stop', payload);

    // Reset state after stopping commute
    setActiveCommute(null);
    setStartTime(null);
    setActiveCommutevalue(false);
    setTravelMode('');
    setCarType('');
    setBikeType('');
    setpublicTransportType('');
    setPassengers([]);

    console.log("Commute stopped and fields cleared");

    // Call the parent handler to refresh components
    onFinishCommute();
  } catch (err) {
    console.error('Error stopping commute:', err);
  }
};

  const calculateDistance = (startCoords, endCoords) => {
    if (!startCoords || !endCoords || !startCoords.lat || !startCoords.lng || !endCoords.lat || !endCoords.lng) {
      return 0;
    }

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(endCoords.lat - startCoords.lat);
    const dLon = toRad(endCoords.lng - startCoords.lng);
    const lat1 = toRad(startCoords.lat);
    const lat2 = toRad(endCoords.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const toRad = (value) => value * Math.PI / 180;

  const calculateDuration = () => {
    if (!startTime) return 0;
    const endTime = new Date();
    return Math.floor((endTime - startTime) / (1000 * 60)); // Duration in minutes
  };


  const calculateCommuteWithManualDistance = async () => {
    try {
      if (!manualDistance || isNaN(manualDistance)) {
        alert('Please enter a valid distance in kilometers.');
        return;
      }
  
      const token = localStorage.getItem('token');
  
      // Determine the specific mode based on travelMode
      let mode;
      if (travelMode === 'Car') {
        mode = carType; // Use selected car type
      } else if (travelMode === 'Bike') {
        mode = bikeType; // Use selected bike type
      } else if (travelMode === 'PublicTransport') {
        mode = publicTransportType; // Use selected public transport type
      } else {
        mode = travelMode; // Fallback to generic travel mode
      }
  
      // API call to calculate commute, sending both travelMode and mode
      const res = await api.post('/commute/calculate', {
        travelMode: travelMode, // Include the main travel mode
        mode: mode,            // Include the specific type of travel mode
        distance: parseFloat(manualDistance),
        token: token,
      });
  
      console.log(res.data);
  
      // Reset inputs after successful calculation
      setManualDistance('');
      setActiveCommute(null);
          // Call the parent handler to refresh components
    onFinishCommute();
    } catch (err) {
      console.error('Error calculating commute:', err);
    }
  };
  

  const toggleGPS = () => {
    setGpsEnabled(!gpsEnabled);
  };

  const addPassenger = () => {
    if (passengers.length < 4) {
      setPassengers([...passengers, { email: '', location: '', coordinates: { lat: null, lng: null } }]);
    }
  };

  const fetchCoordinates = async (index) => {
    const passenger = passengers[index];
    try {
      // Check if email exists in database
      const emailExistsRes = await api.post('/user/check-email', { email: passenger.email });
      if (!emailExistsRes.data.exists) {
        alert('Email does not exist in the database.');
        return;
      }
      
      // Fetch coordinates using Google Maps API
      const apiKey = 'AIzaSyC8V1wSBW1Jk8YDENY8HQcjySaCmeBNskE'; // Replace with your Google Maps API Key
      const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: { address: passenger.location || 'Default Location', key: apiKey }
      });
      
      const { results } = res.data;
      
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        const updatedPassengers = [...passengers];
        updatedPassengers[index].coordinates = { lat, lng };
        updatedPassengers[index].location = `Lat: ${lat}, Lng: ${lng}`;
        setPassengers(updatedPassengers);
      } else {
        alert('No results found for the entered location.');
      }
    } catch (err) {
      console.error('Error fetching coordinates:', err);
      alert('Failed to fetch coordinates. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h4">Commute Tracker</Typography>
      
      <Select value={travelMode} onChange={(e) => setTravelMode(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
        <MenuItem value="">Choose a mode</MenuItem>
        <MenuItem value="Car">Car</MenuItem>
        <MenuItem value="Bike">Bike</MenuItem>
        <MenuItem value="PublicTransport">public Transport</MenuItem>
      </Select>

      {travelMode === 'Car' && (
        <>
          <Select value={carType} onChange={(e) => setCarType(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="">Choose a car type</MenuItem>
            {carTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
          <Button onClick={toggleGPS}>{gpsEnabled ? "Disable GPS" : "Enable GPS"}</Button>
          {gpsEnabled && (
            <>
              <Button onClick={addPassenger}>Add Passenger</Button>
              {passengers.map((passenger, index) => (
                <Box key={index}>
                  <TextField
                    label="Passenger Email"
                    value={passenger.email}
                    onChange={(e) => {
                      const updatedPassengers = [...passengers];
                      updatedPassengers[index].email = e.target.value;
                      setPassengers(updatedPassengers);
                    }}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Passenger Location"
                    value={passenger.location}
                    onChange={(e) => {
                      const updatedPassengers = [...passengers];
                      updatedPassengers[index].location = e.target.value;
                      setPassengers(updatedPassengers);
                    }}
                    sx={{ mb: 1 }}
                  />
                  <Button onClick={() => fetchCoordinates(index)} variant="outlined">Fetch Coordinates</Button>

                </Box>
              ))}
                    {/* Start/Stop Commute Button */}
      {activeCommutevalue ? (
        <Button onClick={stopCommuteWithGPS} variant="contained" color="error">
          Stop Commute
        </Button>
      ) : (
        <Button onClick={startCommute} variant="contained" color="primary">
          Start Commute
        </Button>
      )}
            </>
          )}

          
          {!gpsEnabled && (
            <>
              <TextField
                label="Manual Distance (km)"
                value={manualDistance}
                onChange={(e) => setManualDistance(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button onClick={calculateCommuteWithManualDistance} variant="contained">Calculate Commute</Button>
            </>
          )}
        </>
      )}

      {/* Conditional Rendering for Bike Type */}
      {travelMode === "Bike" && (
        <>
          <Select value={bikeType} onChange={(e) => setBikeType(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="">Choose a bike type</MenuItem>
            {bikeTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
          <Button onClick={toggleGPS}>{gpsEnabled ? "Disable GPS" : "Enable GPS"}</Button>
          {gpsEnabled && (
            <>
        {/* Start/Stop Commute Button */}
      {activeCommutevalue ? (
        <Button onClick={stopCommuteWithGPS} variant="contained" color="error">
          Stop Commute
        </Button>
      ) : (
        <Button onClick={startCommute} variant="contained" color="primary">
          Start Commute
        </Button>
      )}
            </>
          )}

          
          {!gpsEnabled && (
            <>
              <TextField
                label="Manual Distance (km)"
                value={manualDistance}
                onChange={(e) => setManualDistance(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button onClick={calculateCommuteWithManualDistance} variant="contained">Calculate Commute</Button>
            </>
          )}
        </>
      )}

      {/* Conditional Rendering for Public Transport Type */}
      {travelMode === "PublicTransport" && (
        <>
          <Select value={publicTransportType} onChange={(e) => setpublicTransportType(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="">Choose a public transport type</MenuItem>
            {publicTransports.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
          <Button onClick={toggleGPS}>{gpsEnabled ? "Disable GPS" : "Enable GPS"}</Button>
          {gpsEnabled && (
            <>

              {passengers.map((passenger, index) => (
                <Box key={index}>

      {/* Start/Stop Commute Button */}
      {activeCommutevalue ? (
        <Button onClick={stopCommuteWithGPS} variant="contained" color="error">
          Stop Commute
        </Button>
      ) : (
        <Button onClick={startCommute} variant="contained" color="primary">
          Start Commute
        </Button>
      )}
                </Box>
              ))}
            </>
          )}

          
          {!gpsEnabled && (
            <>
              <TextField
                label="Manual Distance (km)"
                value={manualDistance}
                onChange={(e) => setManualDistance(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button onClick={calculateCommuteWithManualDistance} variant="contained">Calculate Commute</Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default CommuteTracker;
