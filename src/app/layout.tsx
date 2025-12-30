import React from 'react'; // Asegúrate de importar React
import localFont from "next/font/local";
import "./globals.css";
import type { Metadata, Viewport } from "next";
//import Image from 'next/image'
//import logo from './favicon/android-chrome-512x512.png'
import UserBadge from './components/UserBadge'
import NavItem from './components/NavItems'
import { AuthProvider } from '@/context/AuthContext'
import { HomeIcon, ProyectoIcon, CapasIcon, AyudaIcon, AcercaDeIcon, ContactoIcon, IdiomaIcon, FillWindPathIcon } from './components/IconosSVG';

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

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased grid min-h-screen w-full grid-rows-[repeat(24,1fr)] grid-cols-[repeat(24,1fr)]`}>
    <AuthProvider>
      <header className="row-[1/7] col-[1/7] bg-blue-950 grid grid-rows-6 grid-cols-6">

        <div className="row-[1/5] col-[1/-1] h-full flex items-center">
          <div className="relative h-full w-full flex items-center justify-center">
            <FillWindPathIcon className="w-32 h-32" colorClass="#000000" />
          </div>
        </div>
        <div className="row-[5/7] col-[1/-1] flex items-center justify-center h-full"> <h1 className="text-white font-bold text-xl"> Filament Path Generator </h1> </div>

      </header>

      <aside className="row-[7/24] col-[1/7] bg-blue-950">
        <nav className="grid grid-rows-[repeat(17,1fr)] h-full text-blue-50">

          <NavItem href="/" text="Inicio" icon={<HomeIcon className="w-10 h-10" colorClass="var(--blue-50)" />} />
          <NavItem href="/proyecto" text="Proyecto" icon={<ProyectoIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
          <NavItem href="/capas" text="Capas" icon={<CapasIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
          <NavItem href="/ayuda" text="Ayuda" icon={<AyudaIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
          <NavItem href="/acercaDe" text="Acerca de" icon={<AcercaDeIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
          <NavItem href="/contacto" text="Contacto" icon={<ContactoIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>
          <NavItem href="/idioma" text="Idioma" icon={<IdiomaIcon className="w-10 h-10" colorClass="var(--blue-50)" />}/>

        </nav>
      </aside>

      <main className="row-[1/24] col-[7/25] h-full">
        {children}
      </main>
      <aside className="row-[1/7] col-[22/25] flex items-center justify-end pr-4">
          {/* Usuario */}
          <UserBadge />
      </aside>
      <footer className="row-[24/25] col-[1/25] bg-red-100 text-red-950 text-center flex items-center justify-center">
        Aplicación creada por&nbsp;<span className="font-bold">Gustavo Francisco Eichhorn</span>
      </footer>
    </AuthProvider>
  </body>
</html>
  );
}
