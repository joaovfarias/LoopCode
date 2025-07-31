"use client";

import { SpeedDial, SpeedDialAction } from "@mui/material";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/auth-guard';
import CodeIcon from '@mui/icons-material/Code';
import TodayIcon from '@mui/icons-material/Today';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
export default function CustomSpeedDial() {
     const router = useRouter();
     const pathname = usePathname();
     const { loading } = useAuth() || {}; 
     const hiddenRoutes = ['/login', '/register'];

     if (hiddenRoutes.includes(pathname) || loading) {
          return null;
     }

     return (
          <SpeedDial
               ariaLabel="Menu de ações"
               sx={{
                    position: "fixed",   // <-- ESSENCIAL para ficar flutuante
                    bottom: 24,
                    right: 24,
                    zIndex: 1500,        // <-- acima do conteúdo
               }}
          icon={<MenuIcon />}
     >
          <SpeedDialAction
               icon={<TodayIcon />}
               tooltipTitle="Desafio Diário"
               onClick={() => router.push("/daily-challenge")}
          />
          
          <SpeedDialAction
               icon={<FormatListBulletedIcon />}
               tooltipTitle="Criar Lista"
               onClick={() => router.push("/create-list")}
          />

          <SpeedDialAction
               icon={<CodeIcon />}
               tooltipTitle="Criar Exercício"
               onClick={() => router.push("/create-exercise")}
          />
     </SpeedDial>
     );
}
