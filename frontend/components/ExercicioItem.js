'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useRouter } from 'next/navigation';

export default function ExercicioItem({ exercicio, onUpvote, onDownvote }) {
  const router = useRouter();

  const handleBoxClick = () => {
    router.push(`/exercises/${exercicio.id}`);
  };

  return (
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

      <Box className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "card.secondary",
            borderRadius: "25px",
            px: 0.4,
            py: 0.2,
            gap: 0.5,
            width: "100px",
            justifyContent: "space-between",
          }}

        >
          <IconButton size="small" onClick={onUpvote}>
            <ArrowDropUpIcon sx={{ color: exercicio.userVote === 1 ? "red" : "gray" }} />
          </IconButton>

          <Typography variant="body2">{exercicio.voteCount}</Typography>

          <IconButton size="small" onClick={onDownvote}>
            <ArrowDropDownIcon sx={{ color: exercicio.userVote === -1 ? "blue" : "gray" }} />
          </IconButton>

        </Box>
      </Box>
    </Box>
  );
}
