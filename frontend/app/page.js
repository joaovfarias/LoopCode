"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  Stack,
  Chip,
  Divider,
  IconButton,
  Pagination,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
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

const atividadesMock = [
  {
    id: 1,
    autor: "MasterOfPuppets",
    titulo: "Calculadora em C utilizando MySQL",
    descricao: "这是我的练习题，请你们检查。",
    votos: 98,
    tempo: "1h ago",
  },
  {
    id: 2,
    autor: "Florismunda",
    titulo: "Title",
    descricao: "Description",
    votos: 17,
    tempo: "1h ago",
  },
  {
    id: 3,
    autor: "Mr.LonelyCat",
    titulo: "العنوان",
    descricao: "الوصف",
    votos: 54,
    tempo: "2h ago",
  },
  {
    id: 4,
    autor: "MasterOfPuppets",
    titulo: "Calculadora em C utilizando MySQL",
    descricao: "这是我的练习题，请你们检查。",
    votos: 98,
    tempo: "1h ago",
  },
  {
    id: 5,
    autor: "Florismunda",
    titulo: "Title",
    descricao: "Description",
    votos: 17,
    tempo: "1h ago",
  },
  {
    id: 6,
    autor: "Mr.LonelyCat",
    titulo: "العنوان",
    descricao: "الوصف",
    votos: 54,
    tempo: "2h ago",
  },
  {
    id: 7,
    autor: "MasterOfPuppets",
    titulo: "Calculadora em C utilizando MySQL",
    descricao: "这是我的练习题，请你们检查。",
    votos: 98,
    tempo: "1h ago",
  },
  {
    id: 8,
    autor: "Florismunda",
    titulo: "Title",
    descricao: "Description",
    votos: 17,
    tempo: "1h ago",
  },
  {
    id: 9,
    autor: "Mr.LonelyCat",
    titulo: "العنوان",
    descricao: "الوصف",
    votos: 54,
    tempo: "2h ago",
  },
  {
    id: 10,
    autor: "MasterOfPuppets",
    titulo: "Calculadora em C utilizando MySQL",
    descricao: "这是我的练习题，请你们检查。",
    votos: 98,
    tempo: "1h ago",
  },
  {
    id: 11,
    autor: "Florismunda",
    titulo: "Title",
    descricao: "Description",
    votos: 17,
    tempo: "1h ago",
  },
  {
    id: 12,
    autor: "Mr.LonelyCat",
    titulo: "العنوان",
    descricao: "الوصف",
    votos: 54,
    tempo: "2h ago",
  },
];

export default function HomePage() {
  const [filtro, setFiltro] = useState("Tudo");
  const [voteStatus, setVoteStatus] = useState(null); // 'up', 'down', or null

  {
    /* Estado para votos */
  }
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

  {
    /* Estado para paginação */
  }
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 8;

  const totalPaginas = Math.ceil(atividadesMock.length / ITENS_POR_PAGINA);

  const handlePaginaChange = (_, novaPagina) => {
    setPagina(novaPagina);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const atividadesVisiveis = atividadesMock.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  );

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
      {/* TODO: Implementar a lógica para exibir as listas do usuário e criar um link para elas */}
      {/* TODO: Implementar a lógica de exibição das atividades após receber da API */}
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
          {atividadesVisiveis.map((atv) => (
            <Box
              key={atv.id}
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
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" color="gray">
                  {atv.autor} · {atv.tempo}
                </Typography>
              </Box>

              <Typography variant="subtitle1" fontWeight="bold">
                {atv.titulo}
              </Typography>

              <Typography variant="body2" color="gray">
                {atv.descricao}
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
                >
                  <IconButton size="small" onClick={handleUpvote}>
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
                    {atv.votos}
                  </Typography>

                  <IconButton size="small" onClick={handleDownvote}>
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
                >
                  <IconButton size="small">
                    <ReplyIcon
                      sx={{ color: "white", transform: "scaleX(-1)" }}
                    />
                    {/* TODO: Implementar funcionalidade de compartilhamento */}
                  </IconButton>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPaginas}
            page={pagina}
            onChange={handlePaginaChange}
            color="primary"
          />
        </Box>
        <SpeedDial /> {/* Adicionando o SpeedDial aqui */}
      </Box>
    </Box>
  );
}
