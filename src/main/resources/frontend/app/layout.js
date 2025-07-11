import { Inter } from "next/font/google";
import "./globals.css";
import MuiThemeProvider from './theme-provider';
import NavWrapper from '../components/NavWrapper';
import { Container } from '@mui/material';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Loop Code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>
        <MuiThemeProvider>
          <NavWrapper />
          <Container maxWidth="xl">
            {children}
          </Container>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
