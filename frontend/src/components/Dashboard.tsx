import React, { useEffect, useState } from 'react';
import EmbedModal from './NewEmbedModal';
import { Container, Grid, Card, CardContent, Typography, Button, CardMedia, Box, Grid2 } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Icon from "@mui/material/Icon"
import { getAuth } from 'firebase/auth';

export type Embed = {
  id: string;
  title: string;
  code: string;
};

const Dashboard = () => {
  const [embeds, setEmbeds] = useState<Embed[]>([]);

  const [open, setOpen] = useState(false);
  const [toEditEmbed, setToEditEmbed] = useState<Embed>();

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) {
      window.location.href = '/login';
    }
    else {
      fetchEmbeds();
    }
  }, []);

  const fetchEmbeds = () => {
    const token = localStorage.getItem('firebaseToken');
    fetch(process.env.REACT_APP_BACKEND_ENDPOINT + 'api/embeds', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: "GET"
    }).then(response => {
      if (!response.ok) throw new Error('Failed to fetch embeds');

      const data = response.json().then(json => setEmbeds(json));
    }).catch(error => {
      console.error('Error fetching embeds:', error);

    });
  }

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

  const editEmbed = (id: string) => {
    setToEditEmbed(embeds.find(e => e.id === id))
    setOpen(true);
  };

  const onModalClose = () => {
    fetchEmbeds()
    setOpen(false)
    setToEditEmbed(undefined);
  }

  return (
    <Container disableGutters maxWidth="xl" sx={{ width: "100%" }}>
      <Box display={'flex'} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          New Embed
        </Button>
      </Box>

      <EmbedModal open={open} onClose={onModalClose} toEditEmbed={toEditEmbed} />

      <Grid2 container spacing={3}>
        {embeds.map(embed => (
          <Grid2 key={embed.id}>
            <Card>
              <CardMedia
                component="iframe"
                src={process.env.REACT_APP_BACKEND_ENDPOINT + "/embed/" + embed.id}
                height="150"
                title={embed.title}
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  {embed.title}
                </Typography>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Button onClick={() => getEmbedURL(embed.id)} variant="outlined" color="primary">
                    <Icon>link</Icon>
                  </Button>
                  <Button onClick={() => getEmbedCode(embed.code)} variant="outlined" color="primary">
                    <Icon>code</Icon>
                  </Button>
                  <Button onClick={() => editEmbed(embed.id)} variant="contained" color="primary">
                    <Icon>edit</Icon>
                  </Button>
                  <Button onClick={() => deleteEmbed(embed.id)} variant="contained" color="error">
                    <Icon>delete</Icon>
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default Dashboard;