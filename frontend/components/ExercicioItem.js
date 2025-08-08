"use client";

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useRouter } from "next/navigation";

export default function ExercicioItem({
  exercicio,
  onUpvote,
  onDownvote,
  onlyVotes = false,
}) {
  const router = useRouter();

  const handleBoxClick = () => {
    router.push(`/exercises/${exercicio.id}`);
  };

  if (onlyVotes) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "card.primary",
            borderRadius: "25px",
            border: "2px solid",
            borderColor: "primary.main",
            px: 0.4,
            py: 0.2,
            gap: 0.5,
            width: "95px",
            justifyContent: "space-between",
          }}
        >
          <IconButton size="small" onClick={onUpvote} disabled={true}>
            <ArrowDropUpIcon />
          </IconButton>

          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {exercicio?.voteCount}
          </Typography>

          <IconButton size="small" onClick={onDownvote} disabled={true}>
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2,
        borderBottom: "1px solid",
        borderColor: "grey.700",
        cursor: "pointer",
      }}
      onClick={handleBoxClick}
    >
      <Box>
        <Typography
          sx={{
            transition: "color 0.15s",
            "&:hover": {
              color: (theme) => theme.palette.primary.dark,
            },
            cursor: "pointer",
          }}
        >
          {exercicio.title}
        </Typography>
        <Typography variant="caption" color="gray">
          {exercicio.language.name}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "card.primary",
            borderRadius: "25px",
            border: "2px solid",
            borderColor: "primary.main",
            px: 0.4,
            py: 0.2,
            gap: 0.5,
            width: "100px",
            justifyContent: "space-between",
          }}
        >
          <IconButton size="small" onClick={onUpvote}>
            <ArrowDropUpIcon
              sx={{ color: exercicio.userVote === 1 ? "primary.main" : "gray" }}
            />
          </IconButton>

          <Typography variant="body2">{exercicio.voteCount}</Typography>

          <IconButton size="small" onClick={onDownvote}>
            <ArrowDropDownIcon
              sx={{
                color: exercicio.userVote === -1 ? "primary.main" : "gray",
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
