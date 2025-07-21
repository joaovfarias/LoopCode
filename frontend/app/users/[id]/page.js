'use client';

import { Avatar, Box, Typography, Card, CardContent, Stack } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ListIcon from '@mui/icons-material/List';
import { use } from 'react';
import ExercicioItem from '@/components/ExercicioItem';
import ListaItem from '@/components/ListaItem';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export default function PerfilUsuario({ params }) {
    const { id } = use(params);

    return (
        <Box className="p-8">
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 6 }}>
                {/* Avatar apenas com largura do conteúdo */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main' }}>
                        <Typography variant="h4" color="white">U</Typography>
                    </Avatar>
                </Box>

                {/* Informações do usuário coladas no avatar */}
                <Box className="ml-3 mt-1">
                    <Typography variant="h6">
                        Usuário {id}
                    </Typography>
                    <Typography variant="body2" color="gray">
                        user@gmail.com
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
                            <Typography variant="body2">8</Typography>
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
                            <Typography variant="body2">25</Typography>
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
                            <Typography variant="body2">5</Typography>
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
                                    {[1, 2, 3, 4, 5, 6, 7].map((item, i) => (
                                        <Box key={i}>
                                            <ExercicioItem exercicio={{ id: i, linguagem: 'JavaScript', votes: i * 2 }} />
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
