'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function ExercicioItem({ exercicio }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditar = () => {
    // lógica para editar
    alert(`Editar exercício ${exercicio.id}`);
    handleMenuClose();
  };

  const handleExcluir = () => {
    // lógica para excluir
    alert(`Excluir exercício ${exercicio.id}`);
    handleMenuClose();
  };

  return (
    <Box className="flex justify-between items-center py-2 rounded-xl">
      <Box>
        <Typography variant="body1">Título {exercicio.id}</Typography>
        <Typography variant="caption" color="gray">
          {exercicio.linguagem}
        </Typography>
      </Box>

      <Box className="flex items-center gap-2">
        <ArrowDropDownIcon />
        <Typography variant="body2">{exercicio.votes}</Typography>
        <ArrowDropUpIcon />

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
    </Box>
  );
}
