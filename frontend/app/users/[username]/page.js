'use client';

import { Avatar, Box, Typography, Card, CardContent, Stack } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ListIcon from '@mui/icons-material/List';
import { use, useEffect } from 'react';
import ExercicioItem from '@/components/ExercicioItem';
import ListaItem from '@/components/ListaItem';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@mui/material/Pagination';

export default function PerfilUsuario({ params }) {
    const { username } = use(params);
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    const [exercises, setExercises] = useState([]);
    const [numExercises, setNumExercises] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
    const [lists, setLists] = useState([]);
    const [listPage, setListPage] = useState(0);
    const [totalListPages, setTotalListPages] = useState(1);
    const [totalLists, setTotalLists] = useState(0);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleVote = async (exerciseId, voteType) => {
        const token = localStorage.getItem("token");
        const endpoint = `${baseUrl}/exercises/${exerciseId}/${voteType}`;
        try {
            const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            if (response.ok) {
                fetchExercises(page); // atualiza os dados após o voto
            } else {
            console.error("Erro ao votar");
            }
        } catch (error) {
            console.error("Erro na requisição de voto", error);
        }
        };

    const fetchUserData = async () => {
            try {
                const response = await fetch(`${baseUrl}/users/${username}`);
                if (!response.ok) {
                    router.push('/404');
                    return;
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
    };

    const fetchExercises = async (pageNumber = 0) => {
        try {
            const response = await fetch(`${baseUrl}/users/${username}/exercises?page=${pageNumber}&size=5&sort=createdAt,desc`);
            if (!response.ok) {
                console.error('Failed to fetch exercises');
                return;
            }
            const data = await response.json();
            setExercises(data.content);
            setTotalPages(data.totalPages);
            setNumExercises(data.totalElements);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    const fetchLists = async (pageNumber = 0) => {
        try {
            const response = await fetch(`${baseUrl}/users/${username}/lists?page=${pageNumber}&size=5&sort=id,desc`);
            if (!response.ok) {
                console.error('Failed to fetch lists');
                return;
            }
            const data = await response.json();
            setLists(data.content);
            setTotalListPages(data.totalPages);
            setTotalLists(data.totalElements);
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [username]);

    useEffect(() => {
        fetchExercises(page);
    }, [username, page]);

    useEffect(() => {
        fetchLists(listPage);
    }, [username, listPage]);

    return (
        <Box className="p-8">
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 6 }}>
                {/* Avatar apenas com largura do conteúdo */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main' }}>
                        <Typography variant="h4" color="white">{userData ? userData.username.charAt(0).toUpperCase() : 'U'}</Typography>
                    </Avatar>
                </Box>

                {/* Informações do usuário coladas no avatar */}
                <Box className="ml-3 mt-1">
                    <Typography variant="h6">
                        {userData ? userData.username : 'Carregando...'}
                    </Typography>
                    <Typography variant="body2" color="gray">
                        {userData ? userData.email : 'Carregando...'}
                    </Typography>

                    <Stack direction="row" spacing={2} className="mt-5">
                        {/* Exercícios */}
                        <Card
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1,
                                borderRadius: 4,
                                color: 'white',
                                boxShadow:0,
                            }}
                        >
                            <CodeIcon />
                            <Typography variant="body2">{numExercises}</Typography>
                        </Card>

                        {/* Listas */}
                        <Card
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1,
                                borderRadius: 4,
                                color: 'white',
                                boxShadow:0,
                            }}
                        >
                            <ListIcon />
                            <Typography variant="body2">{totalLists}</Typography>
                        </Card>

                        {/* Daily */}
                        <Card
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1,
                                borderRadius: 4,
                                color: 'white',
                                boxShadow:0,
                            }}
                        >
                            <LocalFireDepartmentIcon />
                            <Typography variant="body2">{userData ? userData.dailyStreak : 'Carregando...'}</Typography>
                        </Card>
                    </Stack>

                </Box>

            </Box>
            <Box className="flex gap-2">

                <Box className="w-full grid grid-cols-2 gap-10">
                    {/* Exercícios */}
                    <Box className="p-5 " sx={{bgcolor: "card.primary", borderRadius: 2,}}>
                        <Typography variant="h5" className="pb-2">
                            Exercícios
                        </Typography>
                        <Box className="rounded-2xl">
                                <Stack spacing={2}>
                                    {exercises.map((exercicio, i) => (
                                        <Box key={i}>
                                            <ExercicioItem
                                                exercicio={exercicio}
                                                onUpvote={() => handleVote(exercicio.id, "upvote")}
                                                onDownvote={() => handleVote(exercicio.id, "downvote")}
                                                />
                                        </Box>
                                    ))}
                                </Stack>
                        </Box>

                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                            count={totalPages}
                            page={page + 1}
                            onChange={(event, value) => setPage(value - 1)} // Spring começa em 0
                            color="primary"
                            variant="outlined"
                            shape="rounded"
                        />
                    </Box>

                    </Box>

                    {/* Listas */}
                    <Box  className="p-5" sx={{bgcolor: "card.primary", borderRadius: 2,}}>
                        <Typography variant="h5" className="pb-2 text-white">
                            Listas
                        </Typography>
                        <Box className="rounded-2xl">
                                <Stack spacing={2}>
                                    {lists.map((item, i) => (
                                        <Box key={i}>
                                            <ListaItem lista={item} />
                                        </Box>
                                    ))}
                                </Stack>
                        </Box>

                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalListPages}
                                page={listPage + 1}
                                onChange={(event, value) => setListPage(value - 1)}
                                color="primary"
                                variant="outlined"
                                shape="rounded"
                            />
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
