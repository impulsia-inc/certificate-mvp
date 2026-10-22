import { Metadata } from 'next';
import { HeroSection } from '@/components/public/hero-section';
import { ServiciosSection } from '@/components/public/home/ServiciosSection';
import { LaboratorioSection } from '@/components/public/home/LaboratorioSection';
import { ContactoSection } from '@/components/public/home/ContactoSection';

export const metadata: Metadata = {
  title: 'F&N Gemology | Laboratorio & Certificación',
  description:
    'Laboratorio de precisión y certificación soberana para diamantes, gemas de color y alta joyería. Dictámenes colegiados inmutables con rigor microscópico y reconocimiento internacional.',
  openGraph: {
    title: 'F&N Gemology — Certificamos el valor que perdura',
    description:
      'Consulta y verifica la autenticidad de certificaciones gemológicas y de joyería de forma segura y confiable.',
    type: 'website',
    locale: 'es_CO',
    siteName: 'F&N Gemology',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiciosSection />
      <LaboratorioSection />
      <ContactoSection />
    </>
  );
}
