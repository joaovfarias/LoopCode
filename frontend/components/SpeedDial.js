"use client";

import { SpeedDial, SpeedDialAction, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import CreateIcon from '@mui/icons-material/Create';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuIcon from "@mui/icons-material/Menu";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

export default function CustomSpeedDial() {
     const router = useRouter();

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
               onClick={() => router.push("/createActivities")}
          />
          <SpeedDialAction
               icon={<CreateNewFolderIcon />}
               tooltipTitle="Criar Lista"
               onClick={() => router.push("/createLists")}
          />
     </SpeedDial>
     );
}
