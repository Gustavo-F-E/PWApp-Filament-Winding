import React from 'react';
import localFont from "next/font/local";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import UserBadge from './components/UserBadge'
import NavItem from './components/NavItems'
import { AuthProvider } from '@/context/AuthContext'
import { IdiomaProvider } from '@/context/IdiomaContext';
import { HomeIcon, ProyectoIcon, CapasIcon, AyudaIcon, AcercaDeIcon, ContactoIcon, IdiomaIcon, FillWindPathIcon } from './components/IconosSVG';
import TranslatedFooter from "./components/TranslatedFooter";
import { MobileProvider } from '@/context/MobileContext';
import MobileLayoutWrapper from './components/MobileLayoutWrapper';
//import ModalProviderWrapper from './components/ModalProviderWrapper';
import OrientationHandler from './components/OrientationHandler';
import BotonSesion from './components/BotonSesion'
//import { registerServiceWorker } from './registerServiceWorker'

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
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
          <head>
            {/* Meta tag CRUCIAL para orientación en iOS PWA */}
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            {/* ESTA LÍNEA ES LA MÁS IMPORTANTE: */}
            <meta name="apple-mobile-web-app-orientations" content="portrait landscape" />
            
            {/* Para Android/Chrome */}
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes"/>

            <meta name="apple-mobile-web-app-title" content="Filament Path Generator"/>
            <meta name="format-detection" content="telephone=no"/>
          </head>
          <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased lg:grid lg:min-h-screen lg:w-full lg:grid-rows-[repeat(24,1fr)] lg:grid-cols-[repeat(24,1fr)] h-screen w-screen lg:h-auto lg:w-auto overflow-hidden lg:overflow-visible`}
          >
              <IdiomaProvider>
                  <AuthProvider>
                    <MobileProvider>
                    <OrientationHandler />
                      <MobileLayoutWrapper
                        desktopHeader={
                           <header className="row-[1/7] col-[1/7] bg-blue-950 grid grid-rows-6 grid-cols-6 contents">
                              <div className="row-[1/7] col-[1/7] bg-blue-950 grid grid-rows-6 grid-cols-6 h-full w-full">
                                  <div className="row-[1/5] col-[1/-1] h-full flex items-center">
                                      <div className="relative h-full w-full flex items-center justify-center">
                                          <FillWindPathIcon
                                              className="w-[80%] h-[80%] max-w-32 max-h-32"
                                              colorClass="#000000"
                                          />
                                      </div>
                                  </div>
                                  <div className="row-[5/7] col-[1/-1] flex items-center justify-center h-full">
                                      <h1 className="text-white font-bold text-fluid-xl">
                                          Filament Path Generator
                                      </h1>
                                  </div>
                              </div>
                           </header>
                        }
                        desktopAside={
                           <aside className="row-[7/24] col-[1/7] bg-blue-950 flex flex-col h-full">
                              <nav className="flex-grow-[65] text-blue-50">
                                  <div className="grid grid-rows-14 h-full">
                                      <NavItem
                                          href="/"
                                          text="Navegacion.inicio"
                                          icon={
                                              <HomeIcon
                                                  className="w-10 h-10"
                                                  colorClass="var(--blue-50)"
                                              />
                                          }
                                      />
                                      <NavItem
                                          href="/proyecto"
                                          text="Navegacion.proyecto"
                                          icon={
                                              <ProyectoIcon
                                                  className="w-10 h-10"
                                                  colorClass="var(--blue-50)"
                                              />
                                          }
                                      />
                                      <NavItem
                                          href="/capas"
                                          text="Navegacion.capas"
                                          icon={
                                              <CapasIcon
                                                  className="w-10 h-10"
                                                  colorClass="var(--blue-50)"
                                              />
                                          }
                                      />
                                      <NavItem
                                          href="/ayuda"
                                          text="Navegacion.ayuda"
                                          icon={
                                              <AyudaIcon
                                                  className="w-10 h-10"
                                                  colorClass="var(--blue-50)"
                                              />
                                          }
                                      />
                                      <NavItem
                                          href="/acercaDe"
                                          text="Navegacion.acercaDe"
                                          icon={
                                              <AcercaDeIcon
                                                  className="w-10 h-10"
                                                  colorClass="var(--blue-50)"
                                              />
                                          }
                                      />
                                      <NavItem
                                          href="/contacto"
                                          text="Navegacion.contacto"
                                          icon={
                                              <ContactoIcon
                                                  className="w-10 h-10"
                                                  colorClass="var(--blue-50)"
                                              />
                                          }
                                      />
                                      <NavItem
                                          href="/idioma"
                                          text="Navegacion.idioma"
                                          icon={
                                              <IdiomaIcon
                                                  className="w-10 h-10"
                                                  colorClass="var(--blue-50)"
                                              />
                                          }
                                      />
                                  </div>
                              </nav>

                              <div className="flex-grow-[35] flex flex-col justify-center align-center p-4">
                                    <BotonSesion />
                              </div>
                          </aside>
                        }
                        desktopUserBadge={
                           <aside className="row-[1/7] col-[22/25] flex items-center justify-end pr-4">
                              <UserBadge />
                           </aside>
                        }
                        desktopFooter={
                            <footer className="row-[24/25] col-[1/25] bg-red-100 text-red-950 text-center flex items-center justify-center">
                                <TranslatedFooter />
                            </footer>
                        }
                      >
                         {children}
                      </MobileLayoutWrapper>
                    </MobileProvider>
                  </AuthProvider>
              </IdiomaProvider>
          </body>
      </html>
  );
}