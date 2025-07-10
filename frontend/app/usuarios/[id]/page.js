'use client';

import { Avatar, Box, Typography, Card, CardContent, IconButton, Stack } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ListIcon from '@mui/icons-material/List';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { use } from 'react';
import ExercicioItem from '@/components/ExercicioItem';
import ListaItem from '@/components/ListaItem';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export default function PerfilUsuario({ params }) {
  const { id } = use(params);

  return (
    <Box className="p-8">

      <Box className="flex gap-2">
        {/* Perfil lateral */}
        <Box className="w-3xs flex flex-col items-center p-6">
          <Avatar className='mb-2' sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}> 
            <Typography variant="h4">U</Typography>
          </Avatar>
          <Typography variant="h6" className="mt-4">
            Usuário {id}
          </Typography>
          <Typography variant="body2" color="gray">
            user@gmail.com
          </Typography>

          <Stack direction="row" spacing={2} className="mt-6">
            <Box className="text-center rounded-4xl px-5 py-2" 
                 sx={{ backgroundColor: 'primary.main'}}>
              <IconButton sx={{ padding:0}}>
                <CodeIcon />
              </IconButton>
              <Typography variant="body2" sx={{ padding:0}}>8</Typography>
            </Box>
            <Box className="text-center rounded-4xl px-5 pt-2" 
                 sx={{ backgroundColor: 'primary.main'}}> 
              <IconButton sx={{ padding:0}}>
                <ListIcon />
              </IconButton>
              <Typography variant="body2">25</Typography>
            </Box>
            <Box className="text-center rounded-4xl px-5 pt-2" 
                 sx={{ backgroundColor: 'primary.main'}}>
              <IconButton sx={{ padding:0}}>
                <LocalFireDepartmentIcon />
              </IconButton>
              <Typography variant="body2">5</Typography>
            </Box>
          </Stack>
        </Box>

        <Box className="w-3/4 grid grid-cols-2 gap-3">
            {/* Exercícios */}
            <Box>
                <Typography variant="h6" className="pb-2 text-white font-extrabold">
                Exercícios
                </Typography>
                <Card className="rounded-2xl px-1 py-1">
                <CardContent>
                    <Stack spacing={2}>
                    {[1, 2, 3, 4, 5].map((item, i) => (
                        <Box key={i}>
                        <ExercicioItem exercicio={{ id: i, linguagem: 'JavaScript', votes: i * 2 }} />
                        </Box>
                    ))}
                    </Stack>
                </CardContent>
                </Card>
            </Box>

          {/* Listas */}
            <Box>
                <Typography variant="h6" className="pb-2 text-white">
                Listas
                </Typography>
                <Card className="rounded-2xl px-1 py-1">
                <CardContent>
                    <Stack spacing={2}>
                    {[1, 2, 3, 4, 5].map((item, i) => (
                        <Box key={i}>
                        <ListaItem lista={{ id: i, exercicios: i * 3 }} />
                        </Box>
                    ))}
                    </Stack>
                </CardContent>
                </Card>
            </Box>
        </Box>
      </Box>
    </Box>
  );
}
