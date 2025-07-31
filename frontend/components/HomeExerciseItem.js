"use client";

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useRouter } from "next/navigation";

export default function HomeExerciseItem({ exercise, voteStatus, onVote }) {
  const router = useRouter();

  const showFireIcon = exercise.voteCount >= 1;

  const truncateDescription = (desc, limit = 150) => {
    if (!desc) return "";
    return desc.length > limit ? desc.slice(0, limit).trim() + "..." : desc;
  };

  return (
    <Box
      onClick={() => router.push(`/exercises/${exercise.id}`)}
      role="button"
      tabIndex={0}
      sx={{
        position: "relative",
        bgcolor: "card.primary",
        p: 2,
        borderRadius: 5,
        boxShadow: 3,
        width: "100%",
        height: 130,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        overflow: "hidden",
        "&:hover": {
          boxShadow: 6,
          bgcolor: "primary.dark",
        },
      }}
    >
      {/* Container título e chips separados */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ color: "white", flex: 1, mr: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {exercise.title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Chip
            size="small"
            label={exercise ? exercise.difficulty : "Carregando..."}
            sx={{
              bgcolor: `difficulty.${exercise ? exercise.difficulty?.toLowerCase() : "Carregando..."}`,
              color: "white",
              height: 18,
              fontSize: "0.60rem",
              fontWeight: "bold",
              paddingLeft: 0.2,
              paddingRight: 0.2,
            }}
          />
          <Chip
            size="small"
            label={exercise ? exercise.language.name : "Carregando..."}
            sx={{
              bgcolor: "#8B5CF6",
              color: "white",
              height: 18,
              fontSize: "0.60rem",
              fontWeight: "bold",
              paddingLeft: 0.2,
              paddingRight: 0.2,
            }}
          />
        </Stack>
      </Box>

      <Typography variant="body2" color="gray" mb={1} sx={{ mt: 0.5 }}>
        Criado por{" "}
        <a
          href={`/users/${exercise.createdBy.username}`}
          style={{ color: "#8B5CF6", textDecoration: "none", fontWeight: "bold" }}
          onClick={(e) => e.stopPropagation()}
        >
          {exercise.createdBy.username}
        </a>
      </Typography>

      <Typography variant="body2" color="gray" sx={{ pr: 18 }}>
        {truncateDescription(exercise.description)}
      </Typography>

      {/* Bloco de votos fixo no canto inferior direito */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          position: "absolute",
          bottom: 12,
          right: 12,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showFireIcon && (
          <LocalFireDepartmentIcon sx={{ color: "primary.main", fontSize: 26 }} />
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "card.secondary",
            borderRadius: "25px",
            px: 1,
            py: 0.5,
            gap: 1,
            boxShadow: 2,
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onVote(exercise.id, "upvote");
            }}
          >
            <ArrowDropUpIcon sx={{ color: voteStatus === "up" ? "primary.main" : "gray" }} />
          </IconButton>

          <Typography
            sx={{ color: "white", fontWeight: "bold", fontSize: "0.875rem" }}
          >
            {exercise.voteCount}
          </Typography>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onVote(exercise.id, "downvote");
            }}
          >
            <ArrowDropDownIcon sx={{ color: voteStatus === "down" ? "primary.main" : "gray" }} />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}
