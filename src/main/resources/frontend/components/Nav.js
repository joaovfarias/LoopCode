'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  InputBase,
  MenuItem,
  Menu,
  Avatar,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Image from "next/image";
import Link from "next/link";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',           // Adicionado
  alignItems: 'center',      // Alinhamento vertical
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background,
  '&:hover': {
    backgroundColor: theme.palette.background,
  },
  border: `1px solid ${theme.palette.divider}`,
  width: '100%',             // Ocupa o espaço que for dado
  maxWidth: '50ch',          // Limite visual
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 2),
  pointerEvents: 'none',
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%', // cobre 100% da Search
  '& .MuiInputBase-input': {
    width: '100%', // cobre 100% do InputBase
    padding: theme.spacing(1, 1, 1, `calc(1em + ${theme.spacing(4)})`), // considera espaço do ícone
    transition: theme.transitions.create('width'),
  },
}));


export default function Nav() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Meu Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}>Sair</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)', // opcional
        }}
      >

        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* LOGO à esquerda */}
          
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Link href="/" passHref>
                        <Image
              src="/images/logo.png"
              alt="Logo LoopCode"
              width={50}
              height={50}
              priority
            />
            </Link>
          </Box>
          

          {/* Pesquisa centralizada */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          {/* Perfil à direita */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="conta do usuário"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 35, height: 35, bgcolor: 'primary.main' }}>
                        <Typography variant="subtitle1" color="white">U</Typography>
                    </Avatar>
            </IconButton>
          </Box>
        </Toolbar>

      </AppBar>
      {renderMenu}
    </Box>
  );
}
