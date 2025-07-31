'use client';

import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ListaItem({ lista }) {
  const router = useRouter();
  const handleBoxClick = () => {
    router.push(`/users/${lista.ownerUsername}/lists/${lista.id}`);
  };
  return (
    <>
    <Box 
    onClick={handleBoxClick}
    className="flex justify-between items-center py-2 border-b-1 border-neutral-700">
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
          {lista.name}
        </Typography>
        <Typography variant="caption" color="gray">
          {lista.exerciseIds.length} exercícios
        </Typography>
      </Box>
    </Box>
    </>
  );
}
