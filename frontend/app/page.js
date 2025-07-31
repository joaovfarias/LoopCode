"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const botaoEstilo = (ativo = false) => ({
  width: "100%",
  borderRadius: 1,
  px: 3,
  py: 1,
  my: 0.5,
  bgcolor: ativo ? "primary.main" : "card.primary",
  color: "white",
  "&:hover": {
    bgcolor: "card.secondary",
  },
});
const filtros = ["Tudo", "Listas", "Exercícios"];

export default function HomePage() {
  const [filtro, setFiltro] = useState("Tudo");
  const [voteStatus, setVoteStatus] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const observer = useRef();
  const router = useRouter();

  const getExercises = async (page = 0) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${baseUrl}/exercises?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        window.location.href = "/not-found";
      }
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const loadMore = useCallback(async () => {
    if (loading || currentPage >= totalPages) return;
    setLoading(true);
    const data = await getExercises(currentPage);
    if (data) {
      setExercises((prev) => [...prev, ...data.content]);
      setTotalPages(data.totalPages);
      setCurrentPage((prev) => prev + 1);
    }
    setLoading(false);
  }, [currentPage, totalPages, loading]);

  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const intObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );

    intObserver.observe(sentinel);
    return () => {
      if (sentinel) intObserver.unobserve(sentinel);
    };
  }, [loadMore]);

  const handleDownvote = () => {
    setVoteStatus((prev) => (prev === "down" ? null : "down"));
  };

  const handleUpvote = () => {
    setVoteStatus((prev) => (prev === "up" ? null : "up"));
  };

  function handleFireIcon(ex) {
    return ex.votos > 50 ? <LocalFireDepartmentIcon /> : null;
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", color: "white" }}>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: { xs: 2, sm: 3 },
          maxWidth: {
            xs: "100%",
            sm: "700px",
            md: "900px",
            lg: "1100px",
            xl: "1280px",
          },
          mx: "auto",
        }}
      >
        <Stack direction="row" spacing={2} mb={3} pl={2} flexWrap="wrap">
          {filtros.map((item) => (
            <Chip
              key={item}
              label={item}
              clickable
              color={filtro === item ? "primary" : "default"}
              onClick={() => setFiltro(item)}
              sx={{
                bgcolor: filtro === item ? "primary.main" : "card.dark",
                color: "white",
              }}
            />
          ))}
        </Stack>

        <Stack spacing={2} sx={{ borderRadius: "5px", padding: 2 }}>
          {exercises.map((atv) => (
            <Box
              key={atv.id}
              onClick={() => router.push(`/exercises/${atv.id}`)}
              role="button"
              tabIndex={0}
              sx={{
                bgcolor: "card.primary",
                p: 2,
                borderRadius: 5,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                boxShadow: 3,
                width: "100%",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 6,
                  bgcolor: "primary.dark",
                },
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "white" }}>
                {atv.title}
              </Typography>

              <Typography variant="body2" color="gray" mb={1}>
                Criado por{" "}
                {atv ? (
                  <a
                    href={`/users/${atv.createdBy.username}`}
                    style={{ color: "#8B5CF6", textDecoration: "none", fontWeight: "bold" }}
                  >
                    {atv.createdBy.username}
                  </a>
                ) : (
                  "Carregando..."
                )}
              </Typography>

              <Typography variant="body2" color="gray">
                {atv.description}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: "auto" }}>
                {handleFireIcon(atv)}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "card.secondary",
                    borderRadius: "25px",
                    px: 0.4,
                    py: 0.2,
                    gap: 0.5,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote();
                    }}
                  >
                    <ArrowDropUpIcon sx={{ color: voteStatus === "up" ? "red" : "gray" }} />
                  </IconButton>

                  <Typography sx={{ color: "white", fontWeight: "bold", fontSize: "0.875rem" }}>
                    {atv.voteCount}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownvote();
                    }}
                  >
                    <ArrowDropDownIcon
                      sx={{ color: voteStatus === "down" ? "darkblue" : "darkgray" }}
                    />
                  </IconButton>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* Sentinela para carregamento automático */}
        <Box ref={sentinelRef} display="flex" justifyContent="center" mt={4}>
          {loading && <CircularProgress color="primary" />}
        </Box>
      </Box>
    </Box>
  );
}
