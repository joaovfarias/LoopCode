"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import VerifiedUserRounded from "@mui/icons-material/VerifiedUserRounded";
import GppBadRounded from "@mui/icons-material/GppBadRounded";
import CodeIcon from "@mui/icons-material/Code";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useRouter } from "next/navigation";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

export default function HomeExerciseItem({ exercise }) {
  const router = useRouter();

  const [voteCount, setVoteCount] = useState(exercise.voteCount);
  const [userVote, setUserVote] = useState(exercise.userVote);

  const showFireIcon = voteCount >= 1;

  const truncateDescription = (desc, limit = 100) => {
    if (!desc) return "";
    return desc.length > limit ? desc.slice(0, limit).trim() + "..." : desc;
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("token");
  const handleVote = async (type) => {
    try {
      const response = await fetch(
        `${baseUrl}/exercises/${exercise.id}/${type}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        console.error("Erro ao votar");
        return;
      }
      updateVoteLocalmente(type);
    } catch (error) {
      console.error("Erro na requisição de voto:", error);
    }
  };

  const updateVoteLocalmente = (type) => {
    let delta = 0;
    let newStatus = userVote;

    if (type === "upvote") {
      if (newStatus === 1) {
        delta = -1;
        newStatus = null;
      } else if (newStatus === -1) {
        delta = 2;
        newStatus = 1;
      } else {
        delta = 1;
        newStatus = 1;
      }
    } else if (type === "downvote") {
      if (newStatus === -1) {
        delta = 1;
        newStatus = null;
      } else if (newStatus === 1) {
        delta = -2;
        newStatus = -1;
      } else {
        delta = -1;
        newStatus = -1;
      }
    }

    setUserVote(newStatus);
    setVoteCount((prev) => prev + delta);
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
        borderRadius: 2,
        width: "100%",
        height: 110,
        cursor: "pointer",
        transition: "all 0.1s ease-in-out",
        overflow: "hidden",
        "&:hover": {
          boxShadow: 6,
          bgcolor: "primary.dark",
        },
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Container título e chips separados */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            color: "white",
            flex: 1,
            mr: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {exercise.title}

          <Tooltip
            title={
              exercise.verified
                ? "Exercício verificado"
                : "Exercício não verificado"
            }
            placement="right"
          >
            <Chip
              size="small"
              icon={
                exercise.verified ? (
                  <VerifiedUserRounded />
                ) : (
                  <Box
                    sx={{ fontSize: 28, display: "flex", alignItems: "center" }}
                  >
                    <GppBadRounded sx={{ fontSize: 21 }} />
                  </Box>
                )
              }
              sx={{
                backgroundColor: "transparent",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            />
          </Tooltip>
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Chip
            size="small"
            icon={<CalculateIcon />}
            label={
              exercise
                ? exercise.difficulty.charAt(0) +
                  exercise.difficulty.slice(1).toLowerCase()
                : "Carregando..."
            }
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontSize: "0.75rem",
              paddingLeft: 0.3,
              paddingRight: 0.3,
            }}
          />
          <Chip
            size="small"
            icon={<CodeIcon />}
            label={exercise ? exercise.language.name : "Carregando..."}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontSize: "0.75rem",
              paddingLeft: 0.3,
              paddingRight: 0.3,
            }}
          />
          <Chip
            size="small"
            icon={
              exercise?.solved ? (
                <CheckCircleRoundedIcon />
              ) : (
                <CancelRoundedIcon />
              )
            }
            label={exercise.solved ? "Resolvido" : "Não resolvido"}
            sx={{
              bgcolor: exercise.solved ? "#205737" : "#912C2C",
              color: "white",
              fontSize: "0.75rem",
              paddingLeft: 0.3,
              paddingRight: 0.3,
            }}
          />
        </Stack>
      </Box>

      <Typography variant="body2" color="gray">
        Criado por{" "}
        <a
          href={`/users/${exercise.createdBy.username}`}
          style={{
            color: "#8B5CF6",
            textDecoration: "none",
            fontWeight: "bold",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {exercise.createdBy.username}
        </a>
      </Typography>

      <Typography variant="body2" color="gray" sx={{ pr: 18, mt: 0.5 }}>
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
          <LocalFireDepartmentIcon
            sx={{ color: "primary.main", fontSize: 26 }}
          />
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "card.primary",
            borderRadius: "25px",
            border: "2px solid",
            borderColor: "primary.main",
            px: 1,
            py: 0.5,
            gap: 1,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            height: 35,
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleVote("upvote");
            }}
          >
            <ArrowDropUpIcon
              sx={{ color: userVote === 1 ? "primary.main" : "gray" }}
            />
          </IconButton>

          <Typography
            sx={{ color: "white", fontWeight: "bold", fontSize: "0.875rem" }}
          >
            {voteCount}
          </Typography>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleVote("downvote");
            }}
          >
            <ArrowDropDownIcon
              sx={{ color: userVote === -1 ? "primary.main" : "gray" }}
            />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}
