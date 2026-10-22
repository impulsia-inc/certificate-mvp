import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
      className={`${playfair.variable} ${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
