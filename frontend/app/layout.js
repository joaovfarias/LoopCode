// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import MuiThemeProvider from "./theme-provider";
import NavWrapper from "../components/NavWrapper";
import { Container } from "@mui/material";
import AuthGuard from "./auth-guard";
import SpeedDial from "@/components/SpeedDial";
import Warmup from "../components/Warmup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "LoopCode",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>
        <MuiThemeProvider>
          <Warmup />
          <AuthGuard>
            <NavWrapper />
            <SpeedDial />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
              {children}
            </Container>
          </AuthGuard>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
