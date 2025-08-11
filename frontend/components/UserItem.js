"use client";

import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";

export default function UserItem({ user }) {
  const router = useRouter();

  return (
    <Box
      onClick={() => router.push(`/users/${user.username}`)}
      role="button"
      tabIndex={0}
      sx={{
        bgcolor: "card.primary",
        p: 2,
        borderRadius: 2,
        width: "100%",
        height: 110,
        cursor: "pointer",
        transition: "all 0.1s ease-in-out",
        overflow: "hidden",
        display: "flex",
        gap: 2,
        alignItems: "center",
        "&:hover": {
          boxShadow: 6,
          bgcolor: "primary.dark",
        },
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Avatar */}
      <Avatar
        src={user.avatarUrl || ""}
        alt={user.name || user.username}
        sx={{ width: 60, height: 60, bgcolor: "primary.main", fontSize: 28 }}
      >
        {!user.avatarUrl && user.username ? user.username[0].toUpperCase() : null}
      </Avatar>

      {/* Dados do usuário */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            color: "white",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.username}
        </Typography>
        <Typography
          variant="body2"
          color="gray"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 1,
          }}
        >
          {user.email}
        </Typography>
      </Box>

    </Box>
  );
}
