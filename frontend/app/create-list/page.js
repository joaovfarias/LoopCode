'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Pagination,
  CircularProgress,
  Chip
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../auth-guard';
import { useRouter } from 'next/navigation';

export default function CreateList() {
  const router = useRouter();
  const [lista, setLista] = useState([]);
  const [search, setSearch] = useState('');
  const [listaTitulo, setListaTitulo] = useState('');
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('token');
    const { username } = useAuth();

  const getExercises = async (page = 0) => {
    try {
      const response = await fetch(`${baseUrl}/exercises?page=${page}&size=9`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error('Failed to fetch exercises:', response);
      }
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const fetchExercises = async (page = 0) => {
    setLoading(true);
    try {
      const data = await getExercises(page);
      if (data) {
        setExercises(data.content || []);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises(currentPage);
  }, [currentPage]);

  const handleAdd = (item) => {
    if (!lista.find((i) => i.id === item.id)) {
      setLista([...lista, item]);
    }
  };

  const handleRemove = (id) => {
    setLista(lista.filter((item) => item.id !== id));
  };

  const handleCreateList = async () => {
    if (!listaTitulo.trim()) {
      alert('Por favor, insira um título para a lista');
      return;
    }
    
    if (lista.length === 0) {
      alert('Por favor, adicione pelo menos um exercício à lista');
      return;
    }

    try {
      setLoading(true);
      
      const body = {
        name: listaTitulo,
        exerciseIds: lista.map(item => item.id)
      };

      const response = await fetch(`${baseUrl}/users/${username}/lists`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Falha ao criar a lista');
      }

      alert('Lista criada com sucesso!');

      router.push(`/users/${username}`);

    } catch (error) {
      console.error('Error creating list:', error);
      alert('Erro ao criar a lista. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.programmingLanguage?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ 
      width: '100%', 
      height: '88vh', 
      display: 'flex',
      overflow: 'hidden',
      marginTop: 6,
    }}>
     {/* Painel da Lista */}
      <Box sx={{ flex: 1 }}>
        <Paper
          sx={{
            bgcolor: 'card.primary',
            borderRadius: 2,
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            marginRight: 4,

          }}
        >
          <TextField
            fullWidth
            value={listaTitulo}
            onChange={(e) => setListaTitulo(e.target.value)}
            variant="standard"
            InputProps={{
              sx: { fontSize: '1.25rem', textAlign: 'center' },
            }}
            inputProps={{ style: { textAlign: 'center' } }}
            placeholder="Título da Lista"
          />
          <List>
            {lista.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemove(item.id)}
                    sx={{ color: '#ccc' }}
                  >
                    <CloseIcon />
                  </IconButton>
                }
              >
                <ListItemIcon sx={{ color: '#ccc' }}>
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={item.title || item.titulo}
                  secondary={item.programmingLanguage || item.linguagem}
                  sx={{
                    '& .MuiListItemText-primary': { color: '#fff' },
                    '& .MuiListItemText-secondary': { color: '#ccc' },
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Botão fixado na parte de baixo */}
          <Box textAlign="center" mt="auto">
            <Button
              variant="contained"
              sx={{ bgcolor: '#6c63ff', textTransform: 'none' }}
              onClick={handleCreateList}
            >
              Criar Lista
            </Button>
          </Box>
        </Paper>
      </Box>


      {/* Painel de Atividades */}
      <Box sx={{ flex: 1 }}>
        <Paper sx={{ bgcolor: 'card.primary', borderRadius: 2, p: 2, height: '100%' }}>
          <Box display="flex" alignItems="center" >
            <SearchIcon sx={{ mr: 1, color: '#ccc' }} />
            <TextField
              variant="standard"
              placeholder="Pesquisar atividades..."
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { color: '#fff' },
              }}
            />
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress sx={{ color: '#fff' }} />
            </Box>
          ) : (
            <>
              <List>
                {filteredExercises.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleAdd(item)}
                        sx={{ color: '#ccc' }}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ color: '#ccc' }}>
                      <CodeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title} 
                      secondary={item.language.name}
                    />
                    <Chip label={item.difficulty} color="primary" />
                  </ListItem>
                ))}
              </List>
              
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    variant="outlined"
                    shape="rounded"
                    count={totalPages}
                    page={currentPage + 1}
                    onChange={(_, value) => setCurrentPage(value - 1)}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#fff',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#6c63ff !important',
                        color: '#fff',
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}