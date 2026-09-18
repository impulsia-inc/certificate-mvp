import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FYN — Certificación y Verificación de Joyas",
    template: "%s | FYN",
  },
  description:
    "Plataforma de certificación y verificación de joyas. Consulta la información asociada a tu certificado utilizando su número de referencia.",
  openGraph: {
    title: "FYN — Certificación y Verificación de Joyas",
    description:
      "Consulta y verifica la autenticidad de certificaciones de joyería de forma segura y confiable.",
    type: "website",
    locale: "es_CO",
    siteName: "FYN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
