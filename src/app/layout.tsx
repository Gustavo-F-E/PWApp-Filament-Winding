import React from 'react'; // Asegúrate de importar React
import localFont from "next/font/local";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from 'next/link';

//const APP_NAME = "Filament Path Generator";
//const APP_DEFAULT_TITLE = "Filament Path Generator";
//const APP_TITLE_TEMPLATE = "%s - PWA App";
//const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata: Metadata = {
  applicationName: "Filament Path Generator",
  title: {
    default: "Filament Path Generator",
    template: "Filament Path Generator"
  },
  description: "Creada por Gustavo Francisco Eichhorn",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Filament Path Generator",
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Filament Path Generator",
    title: {
      default: "Filament Path Generator",
      template: "Filament Path Generator",
    },
    description: "Creada por Gustavo Francisco Eichhorn",
  },
  twitter: {
    card: "summary",
    title: {
      default: "Filament Path Generator",
      template: "Filament Path Generator",
    },
    description: "Creada por Gustavo Francisco Eichhorn",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <nav className="navigation_bar">
        {/* Botón que enlaza a la página 1 */}
        <Link href="/ejemplo_1" className="btn">
          Grafico de Barras
        </Link>

        {/* Botón que enlaza a la página 2 */}
        <Link href="/parametric" className="btn">
          Grafico Curva Parametrica
        </Link>

        {/* Botón que enlaza a la página 3 */}
        <Link href="/ejemplo_3" className="btn">
          Ir a Ejemplo 3
        </Link>
        <Link href="/three" className="btn">
          Ejemplo biblioteca ThreeJS
        </Link>
        <Link href="/prueba-fast-api" className="btn">
          Ejemplo fast api
        </Link>
        </nav>
        <div>
        {children}
        </div>
        </body>
      </html>
  );
}
