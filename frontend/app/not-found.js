// app/not-found.tsx
"use client";

import { Button, Typography, Box } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        height: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h2" fontWeight="bold">
        404 - Página não encontrada
      </Typography>
      <Typography variant="body1">
        A página que você está procurando não existe.
      </Typography>
      <Button variant="contained" component={Link} href="/">
        Voltar para a Home
      </Button>
    </Box>
  );
}
