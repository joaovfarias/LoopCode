'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function ListaItem({ lista }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditar = () => {
    alert(`Editar lista ${lista.id}`);
    handleMenuClose();
  };

  const handleExcluir = () => {
    alert(`Excluir lista ${lista.id}`);
    handleMenuClose();
  };

  return (
    <Box className="flex justify-between items-center py-2">
      <Box>
        <Typography variant="body1">Título {lista.id}</Typography>
        <Typography variant="caption" color="gray">
          {lista.exercicios} exercícios
        </Typography>
      </Box>

      <IconButton
        aria-label="mais opções"
        onClick={handleMenuOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEditar}>Editar</MenuItem>
        <MenuItem onClick={handleExcluir}>Excluir</MenuItem>
      </Menu>
    </Box>
  );
}
