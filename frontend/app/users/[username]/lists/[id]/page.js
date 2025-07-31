'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Link,
  Paper
} from '@mui/material';

export default function ListPage({ params }) {
    const actualParams = React.use(params);
  const { id, username } = actualParams;

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    const response = await fetch(`${baseUrl}/users/${username}/lists/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    setLoading(true);
    fetchData()
      .then(data => {
        setList(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 6}}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        list && (
            <div>
            <Typography variant="h4">
              {list.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Criado por: {list.ownerUsername}
            </Typography>

            {list.exerciseIds && list.exerciseIds.length > 0 ? (
              <List>
                {list.exerciseIds.map((exerciseId) => (
                <Paper key={exerciseId} sx={{ p: 4, marginBottom: 2, bgcolor: 'card.primary'}}>
                  <ListItem  disablePadding>
                    <ListItemText
                      primary={
                        <Link href={`/exercises/${exerciseId}`} underline="hover">
                          Exercício {exerciseId}
                        </Link>
                      }
                    />
                  </ListItem>
                  </Paper>
                ))}
              </List>
            ) : (
              <Typography variant="body1" mt={2}>
                Nenhum exercício nesta lista.
              </Typography>
            )}
          </div>
        )
      )}
    </Container>
  );
}
