import React from 'react'; // Asegúrate de importar React
import localFont from "next/font/local";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from 'next/link';
import styles from './css/home_layout.module.css';
import Image from 'next/image'
import logo from './favicon/android-chrome-512x512.png'
import userImage from '../../public/images/icons/user_red.svg'

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${styles.body}`}
      >
        <section className={styles.barraSuperior}>
          <div className={`${styles.logo} ${styles.flexCentered}`}>
          <Image
            src={logo}
            alt="Logo Filament Path generator"
              placeholder="blur" // Optional blur-up while loading
              className={styles.logoImage}
          />
          </div>
          <div className={`${styles.titulo} ${styles.flexCentered}`}> <h1>Filament Path Generator</h1></div>
          <div className={`${styles.inicioSecion}`}>
            <Link className={`${styles.linkInicioSecion}`} href="/inicioSecion" title='Iniciar Sesión'>
              <div className={`${styles.btn2} ${styles.flexCentered}`}>Iniciar Sesión</div>
            </Link>
            <Image
                src={userImage}
                alt="usuario"
              className={styles.userImage}
              />
          </div>
          <div className={`${styles.navegacion} ${styles.flexCentered}`}>
            <nav className={styles.navigationBar}>
            {/* Botón que enlaza a la página 1 */}
            <Link href="/" className={styles.btn}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Inicio&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Link>
            <Link href="/prueba-fast-api" className={styles.btn}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ejemplo fast api&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Link>
            <Link href="/crearMandril" className={styles.btn}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Crear Mandril&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Link>
            <Link href="/ayuda" className={styles.btn}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ayuda&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Link>
            <Link href="/acercaDe" className={styles.btn}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Acerca del autor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Link>
            <Link href="/contacto" className={`${styles.btn} ${styles.lastBtn}`}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contacto&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Link>
            </nav>
          </div>
        </section>

        <section className={styles.pages}>
        {children}
        </section>
        <footer className={`${styles.footer}`}><span>Hecho por&nbsp;</span><a href="https://gustavo-f-eichhorn.netlify.app/" title='Portfolio Web del Autor'> Gustavo Francisco Eichhorn</a><span>. Todos los derechos reservados.</span>
        </footer>
        </body>
      </html>
  );
}
