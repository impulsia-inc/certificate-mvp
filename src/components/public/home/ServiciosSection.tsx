import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gem, Diamond } from 'lucide-react';

const services = [
  {
    id: 'gemas',
    badge: 'GEMOLOGÍA AVANZADA',
    title: 'Certificados de Piedras Preciosas & Diamantes',
    description:
      'Determinación de certificados y valoración según las 4Cs (Cut, Color, Clarity, Carat). Laboratorio equipado con tecnología espectroscópica avanzada, certificación internacional (GIA/HRD) y autenticación de origen geográfico para mercados asegurados.',
    features: [
      'Clasificación de las piedras firmes y lazurit',
      'Descripción de las piedras (firmes y montadas) del anillo',
      'Descripción de su estilo y su color y su tono',
    ],
    image: '/demo/jewelry/jewel-001.jpg',
    imageAlt: 'Certificado GIA de piedra preciosa',
    cta: 'Conocer más →',
    href: '#contacto',
    icon: Diamond,
  },
  {
    id: 'joyeria',
    badge: 'INGENIERÍA A LA LUPA',
    title: 'Certificados de Joyas Preciosas',
    description:
      'Examen en detalle rico de orfebrería y alta joyería. Análisis de Fluorescencia UV análisis de inclusiones según criterios CIBJO, EN1675, catalogación bilateral e interrogantes, autenticación de realidad y calibración de Karat y composición de aleaciones.',
    features: [
      'Catalogación de serie/formas',
      'Catalogación de certificación histórica del Artes y linaje',
      'Descripción entre todos los seres de cultería y tamaño',
    ],
    image: '/demo/jewelry/jewel-003.jpg',
    imageAlt: 'Inspección de joya preciosa',
    cta: 'Solicitar peritaje →',
    href: '#contacto',
    icon: Gem,
  },
];

export function ServiciosSection() {
  return (
    <section id="servicios" className="w-full bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12 lg:mb-16">
          <h2 className="font-serif font-medium text-[24px] lg:text-[36px] tracking-title-desktop text-content-titleDesktop">
            Servicios de Certificación
          </h2>
          <p className="text-[13px] lg:text-[14px] text-content-body font-sans max-w-md leading-relaxed">
            Proteja su patrimonio con diagnósticos internacionales CIBJO en instrumentación analítica de última línea.
          </p>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service) => (
            <article
              key={service.id}
              className="group bg-ivory rounded-xl border border-[#E9E8E3] overflow-hidden hover:shadow-elevation-md transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-panel/90 backdrop-blur-sm rounded-md text-[9px] lg:text-[10px] font-semibold tracking-[0.15em] uppercase text-white font-sans">
                    <service.icon className="w-3 h-3" />
                    {service.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8 space-y-4">
                <h3 className="font-serif font-medium text-[18px] lg:text-[22px] text-content-titleDesktop leading-snug">
                  {service.title}
                </h3>

                <p className="text-[13px] lg:text-[14px] text-content-body font-sans leading-relaxed">
                  {service.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-2 pt-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] lg:text-[13px] text-content-body font-sans">
                      <span className="w-1 h-1 rounded-full bg-gold mt-1.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="pt-4">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.08em] uppercase text-gold hover:text-gold-intense transition-colors font-sans group/link"
                  >
                    {service.cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
