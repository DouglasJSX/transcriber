"use server";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  return {
    title: "Assistente de Voz | Transcrição e Respostas",
    description:
      "Um assistente de voz que transcreve seu áudio e responde perguntas automaticamente",
    keywords: [
      "transcrição de voz",
      "assistente de voz",
      "IA conversacional",
      "reconhecimento de fala",
    ],
    openGraph: {
      title: "Assistente de Voz Inteligente",
      description:
        "Transforme sua voz em texto e receba respostas para suas perguntas instantaneamente",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Assistente de Voz",
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    icons: {
      icon: "/favicon.ico",
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
