import React, { useEffect, useState } from 'react';
import NewEmbedModal from './NewEmbedModal';
import { Container, Grid, Card, CardContent, Typography, Button, CardMedia, Box, Grid2 } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Embed = {
  id: string;
  title: string;
  code: string;
};

const Dashboard = () => {
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchEmbeds();
    }
  }, []);

  const fetchEmbeds = async () => {
    try {
      const token = localStorage.getItem('firebaseToken');
      const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/embeds', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: "GET"
      });
      if (!response.ok) {
        throw new Error('Failed to fetch embeds');
      }
      const data = await response.json();
      setEmbeds(data);
    } catch (error) {
      console.error('Error fetching embeds:', error);
    }
  };

  const getEmbedURL = (code: string) => {
    navigator.clipboard.writeText(process.env.REACT_APP_BACKEND_ENDPOINT + "/embed/" + code);
    toast.success('Embed id copied to clipboard!');
  };

  const getEmbedCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Embed code copied to clipboard!');
  };

  const deleteEmbed = async (id: string) => {
    const token = localStorage.getItem('firebaseToken');
    const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/embeds/' + id, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error('Failed to fetch embeds');
    }
    else {
      setEmbeds(embeds.filter(embed => embed.id !== id));
      toast.success('Embed deleted!');
    }
  };

  const onModalClose = () => {
    fetchEmbeds()
    setOpen(false)
  }

  return (
    <Container disableGutters maxWidth="xl" sx={{ width: "100%", height:"100vh"}}>
      <Box display={'flex'} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          New Embed
        </Button>
      </Box>

      <NewEmbedModal open={open} onClose={onModalClose} />
      <Grid2 container spacing={3}>
        {embeds.map(embed => (
          <Grid2  key={embed.id}>
            <Card>
              <CardMedia
                component="iframe"
                src={process.env.REACT_APP_BACKEND_ENDPOINT + "/embed/" + embed.id}
                height="200"
                title={embed.title}
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  {embed.title}
                </Typography>
                <Button onClick={() => getEmbedURL(embed.id)} variant="contained" color="primary">
                  Get URL
                </Button>
                <Button onClick={() => getEmbedCode(embed.code)} variant="outlined" color="primary">
                  Get Code
                </Button>
                <Button onClick={() => deleteEmbed(embed.id)} variant="outlined" color="secondary">
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default Dashboard;