import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MuiThemeProvider from './theme-provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Loop Code",
};


export default function RootLayout({ children }) {
  
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MuiThemeProvider>
        {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
