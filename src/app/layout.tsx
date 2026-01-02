import React from 'react'; // Asegúrate de importar React
import localFont from "next/font/local";
import "./globals.css";
import type { Metadata, Viewport } from "next";
//import Image from 'next/image'
//import logo from './favicon/android-chrome-512x512.png'
import UserBadge from './components/UserBadge'
import NavItem from './components/NavItems'
import { AuthProvider } from '@/context/AuthContext'
import { IdiomaProvider } from '@/context/IdiomaContext';
import { HomeIcon, ProyectoIcon, CapasIcon, AyudaIcon, AcercaDeIcon, ContactoIcon, IdiomaIcon, FillWindPathIcon } from './components/IconosSVG';
import BotonSesion from './components/BotonSesion'

export const metadata: Metadata = {
  applicationName: "Filament Path Generator",
  title: {
    default: "Filament Path Generator",
    template: "Filament Path Generator"
  },
  description: "Creada por Gustavo Francisco Eichhorn",
  manifest: "/manifest.json?v=2",
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

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="es">
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased grid min-h-screen w-full grid-rows-[repeat(24,1fr)] grid-cols-[repeat(24,1fr)]`}>
    <IdiomaProvider>
      <AuthProvider>
        <header className="row-[1/7] col-[1/7] bg-blue-950 grid grid-rows-6 grid-cols-6">

          <div className="row-[1/5] col-[1/-1] h-full flex items-center">
            <div className="relative h-full w-full flex items-center justify-center">
              <FillWindPathIcon className="w-32 h-32" colorClass="#000000" />
            </div>
          </div>
          <div className="row-[5/7] col-[1/-1] flex items-center justify-center h-full"> <h1 className="text-white font-bold text-xl"> Filament Path Generator </h1> </div>

        </header>

        <aside className="row-[7/24] col-[1/7] bg-blue-950 flex flex-col h-full">
          <nav className="flex-grow-[65] text-blue-50">
            {/* Contenido de navegación distribuido uniformemente */}
            <div className="grid grid-rows-14 h-full">
              <NavItem href="/" text="Navegacion.inicio" icon={<HomeIcon className="w-10 h-10" colorClass="var(--blue-50)" />} />
              <NavItem href="/proyecto" text="Navegacion.proyecto" icon={<ProyectoIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
              <NavItem href="/capas" text="Navegacion.capas" icon={<CapasIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
              <NavItem href="/ayuda" text="Navegacion.ayuda" icon={<AyudaIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
              <NavItem href="/acercaDe" text="Navegacion.acercaDe" icon={<AcercaDeIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
              <NavItem href="/contacto" text="Navegacion.contacto" icon={<ContactoIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
              <NavItem href="/idioma" text="Navegacion.idioma" icon={<IdiomaIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
            </div>
          </nav>
          
          {/* Div de sesión - ocupa 30% */}
          <div className="flex-grow-[35] flex flex-col justify-center align p-4">
            <BotonSesion />
          </div>
        </aside>

        <main className="row-[1/24] col-[7/25] h-full overflow-hidden">
            <div className="h-full w-full">
              {children}
            </div>
        </main>
        <aside className="row-[1/7] col-[22/25] flex items-center justify-end pr-4">
            {/* Usuario */}
            <UserBadge />
        </aside>
        <footer className="row-[24/25] col-[1/25] bg-red-100 text-red-950 text-center flex items-center justify-center">
          Aplicación creada por&nbsp;<span className="font-bold">Gustavo Francisco Eichhorn</span>
        </footer>
      </AuthProvider>
    </IdiomaProvider>
  </body>
</html>
  );
}
