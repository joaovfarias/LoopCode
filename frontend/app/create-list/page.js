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
  Chip,
  Divider
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
  const [listaDescricao, setListaDescricao] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('token');
  const { username } = useAuth();

  const getExercises = async (page = 0) => {
    try {
      const base = debouncedSearch.trim()
        ? `${baseUrl}/exercises/search?q=${encodeURIComponent(debouncedSearch.trim())}`
        : `${baseUrl}/exercises`;

      const url = new URL(base);
      url.searchParams.append("sortBy", "votes");
      url.searchParams.append("order", "desc");
      url.searchParams.append("page", page);
      url.searchParams.append("size", 9);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Erro ao buscar exercícios:", response);
        return null;
      }

      return response.json();
    } catch (err) {
      console.error("Erro na requisição:", err);
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
  }, [currentPage, debouncedSearch]);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search); // atualiza com atraso
      setCurrentPage(0); // resetar para a primeira página
    }, 500); // delay em ms

    return () => {
      clearTimeout(handler); // limpa o timeout anterior se o usuário ainda estiver digitando
    };
  }, [search]);




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

    if (!listaDescricao.trim()) {
      alert('Por favor, insira uma descrição para a lista');
      return;
    }

    if (lista.length === 0) {
      alert('Por favor, adicione pelo menos um exercício à lista');
      return;
    }

    try {
      const body = {
        name: listaTitulo,
        description: listaDescricao,
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

    } catch (error) {
      console.error('Error creating list:', error);
      alert('Erro ao criar a lista. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '80vh',
      display: 'flex',
      overflow: 'hidden',
      marginTop: 6,
    }}>
      {/* Painel da Lista */}
      <Box sx={{ flex: 1 }}>
        <Box
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
            sx={{
                mt: 2,
                textarea: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "background.default" },
              }}
            placeholder="Título da Lista"
          />
          <TextField
            fullWidth
            value={listaDescricao}
            onChange={(e) => setListaDescricao(e.target.value)}
            multiline
            minRows={3}
            placeholder="Descrição da Lista"
            sx={{
                mt: 2,
                textarea: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "background.default" },
              }}
          />
          <Divider sx={{ my: 2, bgcolor: '#444' }} />
          <List>
            {lista.map((item) => (
              <ListItem
                sx={{ margin: 0, paddingRight: 0, paddingLeft: 0, paddingTop: 1, paddingBottom: 1 }}
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
              sx={{ bgcolor: 'primary', textTransform: 'none' }}
              onClick={handleCreateList}
            >
              Criar Lista
            </Button>
          </Box>
        </Box>
      </Box>


      {/* Painel de Atividades */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ bgcolor: 'card.primary', borderRadius: 2, p: 2, height: '100%' }}>
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
                {exercises.map((item) => (
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
        </Box>
      </Box>
    </Box>
  );
}