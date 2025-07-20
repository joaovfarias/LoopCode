'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExcluirExercicioDialog from '@/components/ExcluirExercicioDialog';

export default function ExercicioItem({ exercicio }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [openDialog, setOpenDialog] = useState(false); // controle do dialog

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditar = () => {
    handleMenuClose();
  };

  const handleExcluir = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Box className="flex justify-between items-center py-2 border-b-1 border-neutral-700">
        <Box>
          <Typography variant="body1">Título {exercicio.id}</Typography>
          <Typography variant="caption" color="gray">
            {exercicio.linguagem}
          </Typography>
        </Box>

        <Box className="flex items-center gap-2">
          <Box className="flex items-center gap-1 border border-neutral-600 rounded px-2 py-1 w-24 justify-center">
          <ArrowDropDownIcon />
          <Typography variant="body2">{exercicio.votes}</Typography>
          <ArrowDropUpIcon />
          </Box>

          <Box>
          <IconButton aria-label="mais opções" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleEditar}>Editar</MenuItem>
            <MenuItem onClick={handleExcluir}>Excluir</MenuItem>
          </Menu>
          </Box>
        </Box>
      </Box>

      {/* Aqui o dialog é renderizado e controlado via estado */}
      <ExcluirExercicioDialog
        open={openDialog}
        onClose={handleDialogClose}
        exercicio={exercicio}
      />
    </>
  );
}
