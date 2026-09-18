import { Metadata } from "next";
import { HeroSection } from "@/components/public/hero-section";
import { HowItWorks } from "@/components/public/how-it-works";

export const metadata: Metadata = {
  title: "FYN | Certificación y Verificación de Joyas",
  description: "Plataforma oficial para la certificación y verificación de joyas. Consulta la información asociada a tu certificado.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
    </>
  );
}
