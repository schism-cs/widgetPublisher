import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../config/firebase";
import { Container, Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseToken', token);
      console.log('Token stored:', token);
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} display="flex" justifyContent="center">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
              Login
            </Typography>
            <form onSubmit={login}>
              <TextField
                type="email"
                id="email"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <TextField
                type="password"
                id="password"
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;