"use client";

import { SpeedDial, SpeedDialAction } from "@mui/material";
import { useRouter } from "next/navigation";
import CreateIcon from '@mui/icons-material/Create';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuIcon from "@mui/icons-material/Menu";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/auth-guard';

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
               icon={<CalendarTodayIcon />}
               tooltipTitle="Desafio Diário"
               onClick={() => router.push("/dailyChallenge")}
          />
          <SpeedDialAction
               icon={<CreateIcon />}
               tooltipTitle="Criar Exercício"
               onClick={() => router.push("/create-activities")}
          />
          <SpeedDialAction
               icon={<CreateNewFolderIcon />}
               tooltipTitle="Criar Lista"
               onClick={() => router.push("/create-list")}
          />
     </SpeedDial>
     );
}
