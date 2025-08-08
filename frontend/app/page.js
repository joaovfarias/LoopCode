'use client';

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
import { useRouter, useSearchParams } from "next/navigation";


const filtros = ["Exercícios", "Listas"];

export default function HomePage() {
  const [filtro, setFiltro] = useState("Exercícios");
  const [difficulty, setDifficulty] = useState(null);
  const [orderBy, setOrderBy] = useState("votes");

  const [voteStatusMap, setVoteStatusMap] = useState({});
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [lists, setLists] = useState([]);
  const [currentListPage, setCurrentListPage] = useState(0);
  const [totalListPages, setTotalListPages] = useState(1);
  const [loadingLists, setLoadingLists] = useState(false);

  const searchParams = useSearchParams();
  const q = searchParams?.get("q")?.toLowerCase() || "";
  const router = useRouter();


  const sentinelRef = useRef(null);
  const sentinelRefLists = useRef(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Função para buscar resultados de forma unificada
  const getSearchResults = async () => {
    try {
      const url = new URL(`${baseUrl}/search`);
      url.searchParams.append("q", q);
      // Você pode adicionar outros parâmetros de paginação se precisar, como exPage, exSize, etc.

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao buscar resultados");
      return response.json();
    } catch (err) {
      console.error(err);
      return { exercises: [], lists: [], users: [] };
    }
  };

  const getExercises = async (page = 0) => {
    // ... sua função existente ...
    try {
      const url = new URL(`${baseUrl}/exercises`);
      url.searchParams.append("page", page);
      url.searchParams.append("sortBy", orderBy);
      url.searchParams.append("order", "desc");
      if (difficulty) {
        url.searchParams.append("difficulty", difficulty.toUpperCase());
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
    // ... sua função existente ...
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

      const voteMap = {};
      data.content.forEach((ex) => {
        if (ex.userVote === 1) voteMap[ex.id] = "up";
        else if (ex.userVote === -1) voteMap[ex.id] = "down";
        else voteMap[ex.id] = null;
      });
      setVoteStatusMap((prev) => ({ ...prev, ...voteMap }));

      setTotalPages(data.totalPages);
      setCurrentPage((prev) => prev + 1);
    }
    setLoading(false);
  }, [currentPage, totalPages, loading, difficulty, orderBy]); // Adicionei dependências

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


  // Efeito para tratar a busca unificada
  useEffect(() => {
    if (q) {
      setLoading(true);
      getSearchResults().then(data => {
        if (data) {
          setExercises(data.exercises);
          setLists(data.lists.content); // Ajuste para usar o conteúdo da lista
          setFiltro(null); // Desativar os filtros padrão quando a busca está ativa
        }
        setLoading(false);
      });
    } else {
      // Quando a busca é limpa, volte para o estado inicial
      setExercises([]);
      setLists([]);
      setCurrentPage(0);
      setTotalPages(1);
      setCurrentListPage(0);
      setTotalListPages(1);

      // E inicie o carregamento padrão, se necessário
      if (filtro === "Exercícios") {
        loadMoreExercises();
      } else {
        loadMoreLists();
      }
    }
  }, [q]);

  // Efeito original de scroll infinito
  useEffect(() => {
    if (q) return; // Não roda o scroll infinito se a busca estiver ativa

    const sentinel = filtro === "Exercícios" ? sentinelRef.current : sentinelRefLists.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first.isIntersecting) return;

        if (filtro === "Exercícios" && !loading && currentPage < totalPages) {
          loadMoreExercises();
        }

        if (filtro === "Listas" && !loadingLists && currentListPage < totalListPages) {
          loadMoreLists();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [filtro, loading, loadingLists, currentPage, totalPages, currentListPage, totalListPages, loadMoreExercises, loadMoreLists, q]);

  // Efeito para resetar a paginação ao mudar o filtro de dificuldade ou ordenação
  useEffect(() => {
    if (q) return;
    if (filtro === "Exercícios") {
      setExercises([]);
      setVoteStatusMap({});
      setCurrentPage(0);
      setTotalPages(1);
    }
  }, [difficulty, orderBy, filtro, q]); 


  const handleVote = async (exerciseId, type) => {
    try {
      const response = await fetch(
        `${baseUrl}/exercises/${exerciseId}/${type}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        console.error("Erro ao votar");
        return;
      }
      updateVoteLocalmente(exerciseId, type);
    } catch (error) {
      console.error("Erro na requisição de voto:", error);
    }
  };

  const updateVoteLocalmente = (exerciseId, type) => {
    setExercises((prevExercises) =>
      prevExercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;

        const currentVote = voteStatusMap[exerciseId];
        let delta = 0;
        let newStatus = currentVote;

        if (type === "upvote") {
          if (currentVote === "up") {
            delta = -1;
            newStatus = null;
          } else if (currentVote === "down") {
            delta = 2;
            newStatus = "up";
          } else {
            delta = 1;
            newStatus = "up";
          }
        } else if (type === "downvote") {
          if (currentVote === "down") {
            delta = 1;
            newStatus = null;
          } else if (currentVote === "up") {
            delta = -2;
            newStatus = "down";
          } else {
            delta = -1;
            newStatus = "down";
          }
        }

        setVoteStatusMap((prev) => ({
          ...prev,
          [exerciseId]: newStatus,
        }));

        return {
          ...ex,
          voteCount: ex.voteCount + delta,
        };
      })
    );
  };

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
      {q ? (
        <Box mb={2}>
          <Typography variant="h5" component="h2">
            Resultados da busca para: "{q}"
          </Typography>
          <Typography variant="h6" mt={2}>
            Exercícios
          </Typography>
          <Stack spacing={1} mt={1}>
            {loading && exercises.length === 0 && <CircularProgress color="primary" />}
            {!loading && exercises.length === 0 && <Typography color="gray">Nenhum exercício encontrado.</Typography>}
            {exercises.map((exercise) => (
              <HomeExerciseItem
                key={exercise.id}
                exercise={exercise}
                voteStatus={voteStatusMap[exercise.id]}
                onVote={handleVote}
              />
            ))}
          </Stack>
          <Typography variant="h6" mt={4}>
            Listas
          </Typography>
          <Stack spacing={1} mt={1}>
            {loading && lists.length === 0 && <CircularProgress color="primary" />}
            {!loading && lists.length === 0 && <Typography color="gray">Nenhuma lista encontrada.</Typography>}
            {lists.map((list) => (
              <HomeListItem key={list.id} list={list} />
            ))}
          </Stack>
        </Box>
      ) : (
        <>
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
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
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
                        bgcolor: difficulty === level ? "primary.main" : "card.primary",
                        color: "white",
                      }}
                    />
                  ))}
                </Stack>

                <FormControl variant="standard" size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="orderBy-label" sx={{ color: "gray" }}>
                    Ordenar por
                  </InputLabel>
                  <Select
                    labelId="orderBy-label"
                    value={orderBy}
                    label="Ordenar por"
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
                  <HomeExerciseItem
                    key={exercise.id}
                    exercise={exercise}
                    voteStatus={voteStatusMap[exercise.id]}
                    onVote={handleVote}
                  />
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
        </>
      )}
    </Box>
  );
}