"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Pagination,
} from "@mui/material";
import { useRouter } from "next/navigation";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReplyIcon from "@mui/icons-material/Reply";
import SpeedDial from "@/components/SpeedDial"; // Importando o SpeedDial

const botaoEstilo = (ativo = false) => ({
  width: "100%",
  borderRadius: 1,
  px: 3,
  py: 1,
  my: 0.5,
  bgcolor: ativo ? "primary.main" : "card.primary", // fundo escuro
  color: "white",
  "&:hover": {
    bgcolor: "card.secondary", // fundo no hover
  },
});
const filtros = ["Tudo", "JavaScript", "Python", "C", "Listas", "Exercícios"];

export default function HomePage() {
  const [filtro, setFiltro] = useState("Tudo");
  const [voteStatus, setVoteStatus] = useState(null); // 'up', 'down', or null

  const router = useRouter();

  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // começa em 0
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const getExercises = async (page = 0) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${baseUrl}/exercises?page=${page}`, {
        method: "GET",
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getExercises(currentPage);
      if (data) {
        setExercises(data.content);
        setTotalPages(data.totalPages);
      } else {
        setExercises([]);
        setTotalPages(0);
      }
      setLoading(false);
    };
    fetchData();
  }, [currentPage]);



  {/* Estado para votos */ }
  const handleDownvote = () => {
    if (voteStatus === "down") {
      //  setVotes(votes + 1);
      setVoteStatus(null);
    } else {
      //  setVotes(voteStatus === 'up' ? votes - 2 : votes - 1);
      setVoteStatus("down");
    }
  };

  const handleUpvote = () => {
    if (voteStatus === "up") {
      //  setVotes(votes - 1);
      setVoteStatus(null);
    } else {
      //  setVotes(voteStatus === 'down' ? votes + 2 : votes + 1);
      setVoteStatus("up");
    }
  };


  function handleFireIcon(ex) {
    if (ex.votos > 50) {
      return <LocalFireDepartmentIcon />;
    } else {
      return null;
    }
  }

  return (
    <Box
      sx={{ display: "flex", bgcolor: "background.default", color: "white" }}
    >
      {/* TODO: Colocar a opção de filtragem por outras categorias (recente, mais votadas, etc) */}
      {/* Conteúdo principal */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          maxWidth: 1200,
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
        {/* Filtros horizontais */}
        {/* TODO: Implementar a lógica de filtragem */}
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

        {/* Lista de atividades mockadas */}
        <Stack
          spacing={2}
          sx={{
            borderRadius: "5px",
            padding: 2,
          }}
        >
          {exercises.map((atv) => (
            <Box
              key={atv.id}
              onClick={() => router.push(`/activities/${atv.id}`)}
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
                maxWidth: 1200,
                width: "100%",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 6,
                  bgcolor: "primary.dark",
                },
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  color: "white",
                }}
              >
                {atv.title}
              </Typography>

              <Typography variant="body2" color="gray">
                {atv.description}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ ml: "auto" }}
              >
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
                  onClick={(e) => e.stopPropagation()} // Evita que clique nesse box redirecione
                >
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleUpvote(); }}>
                    <ArrowDropUpIcon
                      sx={{ color: voteStatus === "up" ? "red" : "gray" }}
                    />
                  </IconButton>

                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                    }}
                  >
                    90
                  </Typography>

                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDownvote(); }}>
                    <ArrowDropDownIcon
                      sx={{
                        color: voteStatus === "down" ? "darkblue" : "darkgray",
                      }}
                    />
                  </IconButton>
                </Box>

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
                  onClick={(e) => e.stopPropagation()} // Também evita redirecionamento
                >
                  <IconButton size="small">
                    <ReplyIcon
                      sx={{ color: "white", transform: "scaleX(-1)" }}
                    />
                  </IconButton>
                </Box>
              </Stack>
            </Box>

          ))}
        </Stack>
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={(_, value) => setCurrentPage(value - 1)}
            color="primary"
          />
        </Box>
        <SpeedDial /> {/* Adicionando o SpeedDial aqui */}
      </Box>
    </Box>
  );
}
