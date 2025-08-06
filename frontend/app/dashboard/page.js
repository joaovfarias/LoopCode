"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedUserRounded from "@mui/icons-material/VerifiedUserRounded";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AuthGuard from "../auth-guard";

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("usuarios");
  const [exercises, setExercises] = useState({
    content: [],
    totalPages: 1,
    number: 0,
    first: true,
    last: true,
  });
  const [users, setUsers] = useState({
    content: [],
    totalPages: 1,
    number: 0,
    first: true,
    last: true,
  });
  const [bans, setBans] = useState({
    content: [],
    totalPages: 1,
    number: 0,
    first: true,
    last: true,
  });
  const [page, setPage] = useState(1);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const verifyExercise = async (id) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${baseUrl}/exercises/${id}/verify`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Verified exercise successfully");
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getUsers = useCallback(
    async (role) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await fetch(
          `${baseUrl}/users?page=${page - 1}&size=10&role=${role}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Fetched ${role} users:`, data);
        return data;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [page]
  );

  const getExercises = useCallback(async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(
        `${baseUrl}/exercises?page=${page - 1}&size=10`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched exercises:", data);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [page]);

  const getBans = useCallback(async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(
        `${baseUrl}/users/bans?page=${page - 1}&size=10&active=true`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched bans:", data);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedSection === "exercicios") {
        const data = await getExercises();
        if (data) {
          setExercises(data);
        } else {
          setExercises({
            content: [],
            totalPages: 1,
            number: 0,
            first: true,
            last: true,
          });
          console.error("Failed to fetch exercises");
        }
      } else if (selectedSection === "usuarios") {
        const data = await getUsers("USER");
        if (data) {
          setUsers(data);
        } else {
          setUsers({
            content: [],
            totalPages: 1,
            number: 0,
            first: true,
            last: true,
          });
          console.error("Failed to fetch users");
        }
      } else if (selectedSection === "moderadores") {
        const data = await getUsers("MOD");
        if (data) {
          setUsers(data);
        } else {
          setUsers({
            content: [],
            totalPages: 1,
            number: 0,
            first: true,
            last: true,
          });
          console.error("Failed to fetch moderators");
        }
      } else if (selectedSection === "administradores") {
        const data = await getUsers("ADMIN");
        if (data) {
          setUsers(data);
        } else {
          setUsers({
            content: [],
            totalPages: 1,
            number: 0,
            first: true,
            last: true,
          });
          console.error("Failed to fetch administrators");
        }
      } else if (selectedSection === "bans") {
        const data = await getBans();
        if (data) {
          setBans(data);
        } else {
          setBans({
            content: [],
            totalPages: 1,
            number: 0,
            first: true,
            last: true,
          });
          console.error("Failed to fetch bans");
        }
      }
    };
    fetchData();
  }, [page, selectedSection, getExercises, getUsers, getBans]);

  const banUser = async (username) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const reason = prompt("Please enter the ban reason:");
    if (!reason) {
      console.error("Ban reason is required");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/users/${username}/ban`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ banReason: reason }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const message = await response.text();
      alert(message);
      return message;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const unbanUser = async (username) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${baseUrl}/users/${username}/unban`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const message = await response.text();
      alert(message);
      return message;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const changeUserRole = async (username, newRole) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(
        `${baseUrl}/users/${username}/role?role=${newRole}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert(`Role changed successfully for ${username} to ${newRole}`);
      return true;
    } catch (err) {
      console.error(err);
      alert(`Failed to change role: ${err.message}`);
      return false;
    }
  };

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setSelectedRole("");
    setRoleDialogOpen(true);
  };

  const handleRoleConfirm = async () => {
    if (selectedUser && selectedRole) {
      const result = await changeUserRole(selectedUser.username, selectedRole);
      if (result) {
        if (selectedSection === "usuarios") {
          const data = await getUsers("USER");
          if (data) setUsers(data);
        } else if (selectedSection === "moderadores") {
          const data = await getUsers("MOD");
          if (data) setUsers(data);
        } else if (selectedSection === "administradores") {
          const data = await getUsers("ADMIN");
          if (data) setUsers(data);
        }
      }
    }
    setRoleDialogOpen(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const getRoleOptions = () => {
    if (selectedSection === "usuarios") {
      return ["MOD", "ADMIN"];
    } else if (selectedSection === "moderadores") {
      return ["USER", "ADMIN"];
    } else if (selectedSection === "administradores") {
      return ["USER", "MOD"];
    }
    return [];
  };

  const handleNextPage = () => {
    let currentData;
    if (selectedSection === "exercicios") {
      currentData = exercises;
    } else if (selectedSection === "bans") {
      currentData = bans;
    } else {
      currentData = users;
    }

    if (!currentData.last) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    let currentData;
    if (selectedSection === "exercicios") {
      currentData = exercises;
    } else if (selectedSection === "bans") {
      currentData = bans;
    } else {
      currentData = users;
    }

    if (!currentData.first) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setPage(1);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "usuarios":
      case "moderadores":
      case "administradores":
        return (
          <Box sx={{}}>
            {Array.isArray(users.content) && users.content.length > 0 ? (
              <>
                <TableContainer
                  component={Paper}
                  sx={{ bgcolor: "#1e1e2e", mb: 3 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "primary.secondary" }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Username
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Email
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Role
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Daily Streak
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.content.map((user) => (
                        <TableRow
                          key={user.username}
                          sx={{
                            "&:hover": { bgcolor: "#2a2a3e" },
                            bgcolor: "card.primary",
                          }}
                        >
                          <TableCell sx={{ color: "white" }}>
                            {user.username}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              size="small"
                              sx={{
                                bgcolor:
                                  user.role === "ADMIN"
                                    ? "#ff7043"
                                    : user.role === "MOD"
                                    ? "#66bb6a"
                                    : "#42a5f5",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {user.dailyStreak}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                            >
                              {selectedSection === "usuarios" && (
                                <>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                      banUser(user.username)
                                        .then((result) => {
                                          if (result) {
                                            return getUsers("USER");
                                          }
                                        })
                                        .then((data) => {
                                          if (data) setUsers(data);
                                        });
                                    }}
                                  >
                                    Ban
                                  </Button>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() =>
                                      alert(`Timeout user ${user.username}`)
                                    }
                                  >
                                    Timeout
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleRoleChange(user)}
                              >
                                Change Role
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination Controls */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 4,
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handlePreviousPage}
                    disabled={users.first}
                  >
                    <ArrowBackIosNewIcon />
                  </Button>
                  <Typography sx={{ color: "white" }}>
                    Página {users.number + 1} de {users.totalPages}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={users.last}
                  >
                    <ArrowForwardIosIcon />
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: "white" }}>
                Nenhum{" "}
                {selectedSection === "usuarios"
                  ? "usuário"
                  : selectedSection === "moderadores"
                  ? "moderador"
                  : "administrador"}{" "}
                encontrado.
              </Typography>
            )}
          </Box>
        );
      case "bans":
        return (
          <Box sx={{}}>
            {Array.isArray(bans.content) && bans.content.length > 0 ? (
              <>
                <TableContainer
                  component={Paper}
                  sx={{ bgcolor: "#1e1e2e", mb: 3 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "primary.secondary" }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Username
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Email
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Reason
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Admin
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bans.content.map((ban) => (
                        <TableRow
                          key={ban.id}
                          sx={{
                            "&:hover": { bgcolor: "#2a2a3e" },
                            bgcolor: "card.primary",
                          }}
                        >
                          <TableCell sx={{ color: "white" }}>
                            {ban.bannedUsername}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {ban.bannedUserEmail}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {ban.banReason}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {ban.adminUsername}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {new Date(ban.banDate).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                unbanUser(ban.bannedUsername)
                                  .then(() => getBans())
                                  .then((data) => {
                                    if (data) setBans(data);
                                  });
                              }}
                            >
                              Desbanir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination Controls */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 4,
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handlePreviousPage}
                    disabled={bans.first}
                  >
                    <ArrowBackIosNewIcon />
                  </Button>
                  <Typography sx={{ color: "white" }}>
                    Página {bans.number + 1} de {bans.totalPages}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={bans.last}
                  >
                    <ArrowForwardIosIcon />
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: "white" }}>
                Nenhum ban ativo encontrado.
              </Typography>
            )}
          </Box>
        );
      case "timeouts":
        return (
          <Typography variant="h5" sx={{ color: "white" }}>
            Lista de Timeouts
          </Typography>
        );
      case "exercicios":
        return (
          <Box sx={{}}>
            {Array.isArray(exercises.content) &&
            exercises.content.length > 0 ? (
              <>
                <TableContainer
                  component={Paper}
                  sx={{ bgcolor: "#1e1e2e", mb: 3 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "primary.secondary" }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          ID
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Title
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Description
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exercises.content.map((exercise) => (
                        <TableRow
                          key={exercise.id}
                          sx={{
                            "&:hover": { bgcolor: "#2a2a3e" },
                            bgcolor: "card.primary",
                          }}
                        >
                          <TableCell sx={{ color: "white" }}>
                            {exercise.id}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {exercise.title}
                          </TableCell>
                          <TableCell sx={{ color: "white", maxWidth: "300px" }}>
                            {exercise.description.length > 100
                              ? `${exercise.description.substring(0, 100)}...`
                              : exercise.description}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                exercise.verified
                                  ? "Verificado"
                                  : "Não verificado"
                              }
                              size="small"
                              sx={{
                                bgcolor: exercise.verified
                                  ? "#66bb6a"
                                  : "#ff7043",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() =>
                                  alert(`Delete exercise ${exercise.id}`)
                                }
                              >
                                <DeleteIcon />
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                disabled={exercise.verified}
                                onClick={() => {
                                  verifyExercise(exercise.id)
                                    .then(() => getExercises())
                                    .then((data) => {
                                      if (data) setExercises(data);
                                    });
                                }}
                              >
                                <VerifiedUserRounded />
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination Controls */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 4,
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handlePreviousPage}
                    disabled={exercises.first}
                  >
                    <ArrowBackIosNewIcon />
                  </Button>
                  <Typography sx={{ color: "white" }}>
                    Página {exercises.number + 1} de {exercises.totalPages}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={exercises.last}
                  >
                    <ArrowForwardIosIcon />
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: "white" }}>
                Nenhum exercício encontrado.
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "90vh",
        color: "white",
        p: 4,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{ width: 400, display: "flex", flexDirection: "column", gap: 4 }}
      >
        <Box sx={{ bgcolor: "primary.secondary", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ p: 1.5 }}>
            Usuários
          </Typography>
          <Box
            sx={{
              bgcolor: "card.primary",
              p: 1,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                sx={{
                  justifyContent: "flex-start",
                  color: selectedSection === "usuarios" ? "card.main" : "white",
                }}
                fullWidth
                onClick={() => handleSectionChange("usuarios")}
              >
                Usuários
              </Button>
              <Button
                sx={{
                  justifyContent: "flex-start",
                  color:
                    selectedSection === "moderadores" ? "card.main" : "white",
                }}
                fullWidth
                onClick={() => handleSectionChange("moderadores")}
              >
                Moderadores
              </Button>
              <Button
                sx={{
                  justifyContent: "flex-start",
                  color:
                    selectedSection === "administradores"
                      ? "card.main"
                      : "white",
                }}
                fullWidth
                onClick={() => handleSectionChange("administradores")}
              >
                Administradores
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ bgcolor: "primary.secondary", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ p: 1.5 }}>
            Moderação
          </Typography>
          <Box
            sx={{
              bgcolor: "card.primary",
              p: 1,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              gap: 1,
            }}
          >
            <Button
              sx={{
                justifyContent: "flex-start",
                color: selectedSection === "bans" ? "card.main" : "white",
              }}
              fullWidth
              onClick={() => handleSectionChange("bans")}
            >
              Bans
            </Button>
            <Button
              sx={{
                justifyContent: "flex-start",
                color: selectedSection === "timeouts" ? "card.main" : "white",
              }}
              fullWidth
              onClick={() => handleSectionChange("timeouts")}
            >
              Timeouts
            </Button>
          </Box>
        </Box>

        <Box sx={{ bgcolor: "primary.secondary", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ p: 1.5 }}>
            Exercícios
          </Typography>
          <Box
            sx={{
              bgcolor: "card.primary",
              p: 1,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Button
              sx={{
                justifyContent: "flex-start",
                color: selectedSection === "exercicios" ? "card.main" : "white",
                mb: 1,
              }}
              fullWidth
              onClick={() => handleSectionChange("exercicios")}
            >
              Exercícios
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, pl: 20, fontSize: "1rem" }}>{renderContent()}</Box>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
        <DialogTitle>Change Role for {selectedUser?.username}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select New Role</InputLabel>
            <Select
              value={selectedRole}
              label="Select New Role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {getRoleOptions().map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRoleConfirm}
            variant="contained"
            disabled={!selectedRole}
          >
            Change Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN", "MOD"]}>
      <Dashboard />
    </AuthGuard>
  );
}
