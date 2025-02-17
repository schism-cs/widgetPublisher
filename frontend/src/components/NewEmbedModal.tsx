import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NewEmbedModalProps {
  open: boolean;
  onClose: () => void;
}

const NewEmbedModal: React.FC<NewEmbedModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const handleSave = async () => {
    const token = localStorage.getItem('firebaseToken');
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/embeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, code: htmlCode })
      });
      if (!response.ok) {
        throw new Error('Failed to save embed');
      }
      toast.success('Embed saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving embed:', error);
      toast.error('Error saving embed');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 1200, bgcolor: 'background.paper', p: 4, mx: 'auto', mt: '10%', height: 600, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" component="h2" gutterBottom>
          New Embed
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", flex: "1 1" }}>
          <Box sx={{ flex: "1 1" }}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="HTML Code"
              value={htmlCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHtmlCode(e.target.value)}
              margin="normal"
              multiline
              rows={4}
              style={{ height: "100%", resize: "both" }}
            />
          </Box>
          <Box sx={{ flex: "2 1", ml: 2 }}>
            <Box sx={{ border: '1px solid #ccc', p: 2, mt: 1, height: "100%" }}>
              <div style={{ height: "100%" }} dangerouslySetInnerHTML={{ __html: htmlCode }} />
            </Box>
          </Box>
        </Box>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default NewEmbedModal;