import React from 'react'; // Asegúrate de importar React
import localFont from "next/font/local";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from 'next/link';
import styles from './landing-page.module.css';
import Image from 'next/image'
import profilePic from './favicon/android-chrome-512x512.png'
import userImage from './user_red.svg'

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
            src={profilePic}
            alt="Picture of the author"
            width={80} 
            height={80}
            placeholder="blur" // Optional blur-up while loading
          />
          </div>
          <div className={`${styles.titulo} ${styles.flexCentered}`}>Filament Path Generator</div>
          <div className={`${styles.inicioSecion} ${styles.flexCentered}`}>
            <Link href="/inicioSecion" title='Iniciar Sesión'>
              <Image
                src={userImage}
                alt="usuario"
                width={70} 
                height={70}
              />
            </Link></div>
        </section>
        <section  className={`${styles.navegacion} ${styles.flexCentered}`}>
          <nav className={styles.navigationBar}>
          {/* Botón que enlaza a la página 1 */}
          <Link href="/" className={styles.btn}>
            Inicio
          </Link>
          <Link href="/prueba-fast-api" className={styles.btn}>
            Ejemplo fast api
          </Link>
          <Link href="/crear-mandril" className={styles.btn}>
            Crear Bobinado
          </Link>
          <Link href="/ayuda" className={styles.btn}>
            Ayuda
            </Link>
          <Link href="/acercaDe" className={styles.btn}>
            Acerca del autor
          </Link>
          <Link href="/contacto" className={styles.btn}>
            Contacto
          </Link>
          </nav>
        </section>
        <section className={`${styles["cuerpo-dinamico-de-la-pagina"]}`}>
        {children}
        </section>
        <footer className={`${styles.footer}`}><span>Hecho por&nbsp;</span><a href="https://gustavo-f-eichhorn.netlify.app/" title='Portfolio Web del Autor'> Gustavo Francisco Eichhorn</a><span>. Todos los derechos reservados.</span>
        </footer>
        </body>
      </html>
  );
}
