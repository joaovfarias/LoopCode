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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedUserRounded from "@mui/icons-material/VerifiedUserRounded";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AuthGuard from "../auth-guard";

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("exercicios");
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
          `${baseUrl}/users?page=${page - 1}&size=5&role=${role}`,
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
        `${baseUrl}/exercises?page=${page - 1}&size=5`,
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
        `${baseUrl}/users/bans?page=${page - 1}&size=5&active=true`,
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
        // Refresh the current section's data
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
          <Box
            sx={{
              height: "80vh",
              overflow: "auto",
              scrollbarGutter: "stable",
              "&::-webkit-scrollbar": {
                width: "8px",
                backgroundColor: "#232136",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#5b46d6",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#7c5fff",
              },
              scrollbarWidth: "thin",
              scrollbarColor: "#5b46d6 #232136",
            }}
          >
            <Typography variant="h5" sx={{ color: "white", mb: 3 }}>
              Lista de{" "}
              {selectedSection === "usuarios"
                ? "Usuários"
                : selectedSection === "moderadores"
                ? "Moderadores"
                : "Administradores"}
            </Typography>
            {Array.isArray(users.content) && users.content.length > 0 ? (
              <>
                {users.content.map((user) => (
                  <Card
                    key={user.username}
                    sx={{ mb: 2, bgcolor: "#1e1e2e", color: "white" }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography variant="h6">{user.username}</Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              user.role === "ADMIN"
                                ? "lightcoral"
                                : user.role === "MOD"
                                ? "lightgreen"
                                : "lightblue",
                          }}
                        >
                          {user.role}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                        {user.email}
                      </Typography>
                      {selectedSection === "usuarios" && (
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
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
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleRoleChange(user)}
                          >
                            Change Role
                          </Button>
                        </Box>
                      )}
                      {selectedSection === "moderadores" && (
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleRoleChange(user)}
                          >
                            Change Role
                          </Button>
                        </Box>
                      )}
                      {selectedSection === "administradores" && (
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleRoleChange(user)}
                          >
                            Change Role
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}

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
                  <Typography>
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
              <Typography variant="body2">
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
          <Box
            sx={{
              height: "80vh",
              overflow: "auto",
              scrollbarGutter: "stable",
              "&::-webkit-scrollbar": {
                width: "8px",
                backgroundColor: "#232136",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#5b46d6",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#7c5fff",
              },
              scrollbarWidth: "thin",
              scrollbarColor: "#5b46d6 #232136",
            }}
          >
            <Typography variant="h5" sx={{ color: "white", mb: 3 }}>
              Lista de Bans Ativos
            </Typography>
            {Array.isArray(bans.content) && bans.content.length > 0 ? (
              <>
                {bans.content.map((ban) => (
                  <Card
                    key={ban.id}
                    sx={{ mb: 2, bgcolor: "#1e1e2e", color: "white" }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography variant="h6">
                          {ban.bannedUsername}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "lightcoral",
                          }}
                        >
                          BANIDO
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                        {ban.bannedUserEmail}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Razão:</strong> {ban.banReason}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Banido por:</strong> {ban.adminUsername}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Data do Ban:</strong>{" "}
                        {new Date(ban.banDate).toLocaleString()}
                      </Typography>
                      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
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
                      </Box>
                    </CardContent>
                  </Card>
                ))}

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
                  <Typography>
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
              <Typography variant="body2">
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
          <Box
            sx={{
              height: "80vh",
              overflow: "auto",
              scrollbarGutter: "stable",
              "&::-webkit-scrollbar": {
                width: "8px",
                backgroundColor: "#232136",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#5b46d6",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#7c5fff",
              },
              scrollbarWidth: "thin",
              scrollbarColor: "#5b46d6 #232136",
            }}
          >
            {Array.isArray(exercises.content) &&
            exercises.content.length > 0 ? (
              <>
                {exercises.content.map((exercise) => (
                  <Card
                    key={exercise.id}
                    sx={{ mb: 2, bgcolor: "#1e1e2e", color: "white" }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          ID: {exercise.id}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: exercise.verified
                              ? "lightgreen"
                              : "lightcoral",
                          }}
                        >
                          {exercise.verified ? "Verificado" : "Não verificado"}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {exercise.title}
                      </Typography>
                      <Typography variant="body2">
                        {exercise.description}
                      </Typography>
                      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() =>
                            alert(`Delete exercise ${exercise.id}`)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
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
                    </CardContent>
                  </Card>
                ))}

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
                  <Typography>
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
              <Typography variant="body2">
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
        <Box sx={{ bgcolor: "#5b46d6", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Usuários
          </Typography>
          <Box
            sx={{
              bgcolor: "card.primary",
              p: 2,
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

        <Box sx={{ bgcolor: "#5b46d6", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Moderação
          </Typography>
          <Box
            sx={{
              bgcolor: "#1e1e2e",
              p: 2,
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

        <Box sx={{ bgcolor: "#5b46d6", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Exercícios
          </Typography>
          <Box
            sx={{
              bgcolor: "#1e1e2e",
              p: 2,
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
