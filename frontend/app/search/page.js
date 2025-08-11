"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, CircularProgress, Pagination } from "@mui/material";
import HomeExerciseItem from "@/components/HomeExerciseItem";
import HomeListItem from "@/components/HomeListItem";
import UserItem from "@/components/UserItem";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  // Exercícios
  const [exercises, setExercises] = useState([]);
  const [exPage, setExPage] = useState(0);
  const [exTotalPages, setExTotalPages] = useState(0);

  // Listas
  const [lists, setLists] = useState([]);
  const [listPage, setListPage] = useState(0);
  const [listTotalPages, setListTotalPages] = useState(0);

  // Usuários
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const q = searchParams?.get("q")?.toLowerCase() || "";

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getSearchResults = async () => {
    try {
      const url = new URL(`${baseUrl}/search`);
      url.searchParams.append("q", q);
      url.searchParams.append("exPage", exPage);
      url.searchParams.append("exSize", 5);
      url.searchParams.append("listPage", listPage);
      url.searchParams.append("listSize", 5);
      url.searchParams.append("userPage", userPage);
      url.searchParams.append("userSize", 5);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao buscar resultados");

      return response.json();
    } catch (err) {
      console.error(err);
      return {
        exercises: { content: [], totalPages: 0 },
        lists: { content: [], totalPages: 0 },
        users: { content: [], totalPages: 0 }
      };
    }
  };

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    getSearchResults().then((data) => {
      if (data) {
        setExercises(data.exercises.content || []);
        setExTotalPages(data.exercises.totalPages || 0);

        setLists(data.lists.content || []);
        setListTotalPages(data.lists.totalPages || 0);

        setUsers(data.users.content || []);
        setUserTotalPages(data.users.totalPages || 0);
      }
      setLoading(false);
    });
  }, [q, exPage, listPage, userPage]);

  return (
    <Box className="py-5">
      <Typography variant="h5" component="h2">
        Resultados da busca para: "{q}"
      </Typography>

      {/* Exercícios */}
      <Typography variant="h6" mt={2}>Exercícios</Typography>
      <Stack spacing={1} mt={1}>
        {loading && <CircularProgress color="primary" />}
        {!loading && exercises.length === 0 && (
          <Typography color="gray">Nenhum exercício encontrado.</Typography>
        )}
        {exercises.map((exercise) => (
          <HomeExerciseItem key={exercise.id} exercise={exercise} />
        ))}
      </Stack>
      {!loading && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={exTotalPages}
            page={exPage + 1}
            onChange={(e, value) => setExPage(value - 1)}
            color="primary"
          />
        </Box>
      )}

      {/* Listas */}
      <Typography variant="h6" mt={4}>Listas</Typography>
      <Stack spacing={1} mt={1}>
        {loading && <CircularProgress color="primary" />}
        {!loading && lists.length === 0 && (
          <Typography color="gray">Nenhuma lista encontrada.</Typography>
        )}
        {lists.map((list) => (
          <HomeListItem key={list.id} list={list} />
        ))}
      </Stack>
      {!loading && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={listTotalPages}
            page={listPage + 1}
            onChange={(e, value) => setListPage(value - 1)}
            color="primary"
          />
        </Box>
      )}

      {/* Usuários */}
      <Typography variant="h6" mt={4}>Usuários</Typography>
      <Stack spacing={1} mt={1}>
        {loading && <CircularProgress color="primary" />}
        {!loading && users.length === 0 && (
          <Typography color="gray">Nenhum usuário encontrado.</Typography>
        )}
        {users.map((user) => (
          <UserItem key={user.username} user={user} />
        ))}
      </Stack>
      {!loading && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={userTotalPages}
            page={userPage + 1}
            onChange={(e, value) => setUserPage(value - 1)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
