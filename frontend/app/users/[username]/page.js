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

export default function PerfilUsuario({ params }) {
    const { username } = use(params);
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    const [exercises, setExercises] = useState([]);
    const [lists, setLists] = useState([]);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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

    const fetchExercises = async () => {
        try {
            const response = await fetch(`${baseUrl}/users/${username}/exercises`);
            if (!response.ok) {
                console.error('Failed to fetch exercises');
                return;
            }
            const data = await response.json();
            setExercises(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };
    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        
        fetchUserData();
        fetchExercises();
    }, [username]);


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
                            <Typography variant="body2">{exercises.length}</Typography>
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
                            <Typography variant="body2">{lists.length}</Typography>
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
                                            <ExercicioItem exercicio={exercicio} />
                                        </Box>
                                    ))}
                                </Stack>
                        </Box>
                    </Box>

                    {/* Listas */}
                    <Box  className="p-5" sx={{bgcolor: "card.primary", borderRadius: 2,}}>
                        <Typography variant="h5" className="pb-2 text-white">
                            Listas
                        </Typography>
                        <Box className="rounded-2xl">
                                <Stack spacing={2}>
                                    {[1, 2, 3, 4, 5].map((item, i) => (
                                        <Box key={i}>
                                            <ListaItem lista={{ id: i, exercicios: i * 3 }} />
                                        </Box>
                                    ))}
                                </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
