import { Inter } from "next/font/google";
import "./globals.css";
import MuiThemeProvider from './theme-provider';
import NavWrapper from '../components/NavWrapper';
import { Container } from '@mui/material';
import AuthGuard from './auth-guard';

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
          <NavWrapper />
          <Container maxWidth="xl">
            <AuthGuard>
              {children}
            </AuthGuard> 
          </Container>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
