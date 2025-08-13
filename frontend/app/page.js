"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import HomeExerciseItem from "@/components/HomeExerciseItem";
import HomeListItem from "@/components/HomeListItem";

const filtros = ["Exercícios", "Listas"];

export default function HomePage() {
  const [filtro, setFiltro] = useState("Exercícios");
  const [difficulty, setDifficulty] = useState(null);
  const [onlySolved, setOnlySolved] = useState(false);
  const [orderBy, setOrderBy] = useState("votes");

  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [lists, setLists] = useState([]);
  const [currentListPage, setCurrentListPage] = useState(0);
  const [totalListPages, setTotalListPages] = useState(1);
  const [loadingLists, setLoadingLists] = useState(false);

  const sentinelRef = useRef(null);
  const sentinelRefLists = useRef(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getExercises = async (page = 0) => {
    try {
      const url = new URL(`${baseUrl}/exercises`);
      url.searchParams.append("page", page);
      url.searchParams.append("sortBy", orderBy);
      url.searchParams.append("order", "desc");
      if (difficulty) {
        url.searchParams.append("difficulty", difficulty.toUpperCase());
      }
      if (onlySolved) {
        url.searchParams.append("onlySolved", "true");
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao buscar exercícios");
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getLists = async (page = 0) => {
    try {
      const response = await fetch(`${baseUrl}/lists?page=${page}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar listas");
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const loadMoreExercises = useCallback(async () => {
    if (loading || currentPage >= totalPages) return;
    setLoading(true);
    const data = await getExercises(currentPage);
    if (data) {
      setExercises((prev) => [...prev, ...data.content]);
      setTotalPages(data.totalPages);
      setCurrentPage((prev) => prev + 1);
    }
    setLoading(false);
  }, [currentPage, totalPages, loading, difficulty, orderBy]);

  const loadMoreLists = useCallback(async () => {
    if (loadingLists || currentListPage >= totalListPages) return;
    setLoadingLists(true);
    const data = await getLists(currentListPage);
    if (data) {
      setLists((prev) => [...prev, ...data.content]);
      setTotalListPages(data.totalPages);
      setCurrentListPage((prev) => prev + 1);
    }
    setLoadingLists(false);
  }, [currentListPage, totalListPages, loadingLists]);

  // Scroll infinito
  useEffect(() => {
    const sentinel =
      filtro === "Exercícios" ? sentinelRef.current : sentinelRefLists.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first.isIntersecting) return;

        if (filtro === "Exercícios" && !loading && currentPage < totalPages) {
          loadMoreExercises();
        }

        if (
          filtro === "Listas" &&
          !loadingLists &&
          currentListPage < totalListPages
        ) {
          loadMoreLists();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [
    filtro,
    loading,
    loadingLists,
    currentPage,
    totalPages,
    currentListPage,
    totalListPages,
    loadMoreExercises,
    loadMoreLists,
  ]);

  // Resetar paginação ao mudar filtros
  useEffect(() => {
    if (filtro === "Exercícios") {
      setExercises([]);
      setCurrentPage(0);
      setTotalPages(1);
    }
  }, [difficulty, orderBy, filtro]);

  const handleFiltroClick = (item) => {
    setFiltro(item);

    if (item === "Exercícios" && exercises.length === 0) {
      loadMoreExercises();
    }

    if (item === "Listas" && lists.length === 0) {
      setCurrentListPage(0);
      setLists([]);
      loadMoreLists();
    }
  };

  return (
    <Box className="pt-5">
      <Stack direction="row" spacing={2} mb={1} flexWrap="wrap">
        {filtros.map((item) => (
          <Chip
            key={item}
            label={item}
            clickable
            color={filtro === item ? "primary" : "default"}
            onClick={() => handleFiltroClick(item)}
            sx={{
              bgcolor: filtro === item ? "primary.main" : "card.primary",
              color: "white",
            }}
          />
        ))}
      </Stack>

      {filtro === "Exercícios" && (
        <>
          <Stack direction="row" spacing={1}>
            <Chip
              label="Todos"
              clickable
              color={difficulty === null ? "primary" : "default"}
              onClick={() => {
                setDifficulty(null);
                setExercises([]);
                setCurrentPage(0);
                setTotalPages(1);
              }}
              sx={{
                bgcolor: difficulty === null ? "primary.main" : "card.primary",
                color: "white",
              }}
            />
            {["Easy", "Medium", "Hard"].map((level) => (
              <Chip
                key={level}
                label={level}
                clickable
                color={difficulty === level ? "primary" : "default"}
                onClick={() => {
                  setDifficulty(level);
                  setExercises([]);
                  setCurrentPage(0);
                  setTotalPages(1);
                }}
                sx={{
                  bgcolor:
                    difficulty === level ? "primary.main" : "card.primary",
                  color: "white",
                }}
              />
            ))}
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
            mt={1}
          >
            <Chip
              label="Resolvidos"
              clickable
              color={onlySolved ? "primary" : "default"}
              onClick={() => {
                setOnlySolved((prev) => !prev);
                setExercises([]);
                setCurrentPage(0);
                setTotalPages(1);
              }}
              sx={{
                bgcolor: onlySolved ? "primary.main" : "card.primary",
                color: "white",
                mb: 2,
              }}
            />

            <FormControl
              variant="standard"
              size="small"
              sx={{ minWidth: 180, marginTop: -4 }}
            >
              <InputLabel id="orderBy-label" sx={{ color: "gray" }}>
                Ordenar por
              </InputLabel>
              <Select
                labelId="orderBy-label"
                value={orderBy}
                onChange={(e) => {
                  setOrderBy(e.target.value);
                  setExercises([]);
                  setCurrentPage(0);
                  setTotalPages(1);
                }}
                sx={{
                  color: "gray",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "gray",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.light",
                  },
                }}
              >
                <MenuItem value="votes">Mais votados</MenuItem>
                <MenuItem value="createdAt">Mais recentes</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack spacing={1}>
            {exercises.length === 0 && !loading && (
              <Typography color="gray">Nenhum exercício encontrado.</Typography>
            )}
            {exercises.map((exercise) => (
              <HomeExerciseItem key={exercise.id} exercise={exercise} />
            ))}
          </Stack>
          <Box ref={sentinelRef} display="flex" justifyContent="center" mt={4}>
            {loading && <CircularProgress color="primary" />}
          </Box>
        </>
      )}

      {filtro === "Listas" && (
        <>
          <Box>
            <Stack spacing={1} mt={2}>
              {lists.length === 0 && !loadingLists && (
                <Typography color="gray">Nenhuma lista encontrada.</Typography>
              )}
              {lists.map((list) => (
                <HomeListItem key={list.id} list={list} />
              ))}
              {loadingLists && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress color="primary" />
                </Box>
              )}
            </Stack>
            <Box
              ref={sentinelRefLists}
              display="flex"
              justifyContent="center"
              mt={4}
            ></Box>
          </Box>
        </>
      )}
    </Box>
  );
}
