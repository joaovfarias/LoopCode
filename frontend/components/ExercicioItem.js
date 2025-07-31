'use client';

import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useRouter } from 'next/navigation';

export default function ExercicioItem({ exercicio }) {
  const router = useRouter();

  const handleBoxClick = () => {
    router.push(`/exercises/${exercicio.id}`);
  };

  return (
    <>
      <Box
        className="flex justify-between items-center py-2 border-b-1 border-neutral-700"
        sx={{ cursor: 'pointer' }}
        onClick={handleBoxClick}
      >
        <Box>
          <Typography
            sx={{
              transition: 'color 0.15s',
              '&:hover': {
                color: (theme) => theme.palette.primary.dark,
              },
              cursor: 'pointer',
            }}
          >
            {exercicio.title}
          </Typography>
          <Typography variant="caption" color="gray">
            {exercicio.language.name}
          </Typography>
        </Box>

        <Box className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <Box className="flex items-center gap-1 border border-neutral-600 rounded px-2 py-1 w-24 justify-center">
            <ArrowDropDownIcon />
            <Typography variant="body2">{exercicio.voteCount}</Typography>
            <ArrowDropUpIcon />
          </Box>
        </Box>
      </Box>

    </>
  );
}
