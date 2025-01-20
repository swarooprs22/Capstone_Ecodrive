import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ecodrive from "../../images/eco-drive.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header AppBar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Eco Drive
          </Typography>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button color="inherit" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Paper elevation={3} style={{ padding: "2rem" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" color="textPrimary" gutterBottom>
                Welcome to Eco Drive
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Track your carbon footprint, discover eco-friendly travel
                options, and join a community making a positive impact on the
                planet.
              </Typography>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/onboarding")}
                  style={{ marginRight: "1rem" }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                src={ecodrive}
                alt="Eco-friendly travel"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
