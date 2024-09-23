import React from 'react'; // Asegúrate de importar React
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Head from "next/head"; // Importar el componente Head

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

export const metadata: Metadata = {
  title: "Progresive web app",
  description: "Creada por Gustavo Francisco Eichhorn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <Head>
        {/* Incluir favicon correctamente */}
        <link rel="icon" href="./icon.ico" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="./favicon/apple-touch-icon.png"/>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="./images/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="./images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="./images/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="./images/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="./images/android-chrome-512x512.png"/>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        </body>
      </html>
  );
}
