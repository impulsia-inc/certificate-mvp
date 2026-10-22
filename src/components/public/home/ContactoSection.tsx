import React from 'react';
import Image from 'next/image';
import { ContactForm } from './ContactForm';

export function ContactoSection() {
  return (
    <section id="contacto" className="w-full bg-ivory py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ─── Left Column: Heading + Form ─── */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif font-medium text-[24px] lg:text-[36px] tracking-title-desktop text-content-titleDesktop italic">
                Contacto & Solicitud de Cita
              </h2>
              <p className="text-[13px] lg:text-[14px] text-content-body font-sans leading-relaxed max-w-md">
                Comuníquese con nuestro laboratorio para agendar una cita presencial en nuestra sede, solicitar cotización o gemas y alta joyería, con servicio completo de certificación y protección pericial bajo contrato de confidencialidad profesional.
              </p>
            </div>

            {/* Info links */}
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-[12px] text-content-body font-sans">
                <span className="w-1 h-1 rounded-full bg-gold" />
                Protocolo de Confidencialidad
              </p>
              <p className="flex items-center gap-2 text-[12px] text-content-body font-sans">
                <span className="w-1 h-1 rounded-full bg-gold" />
                Horario Flexible
              </p>
              <p className="flex items-center gap-2 text-[12px] text-content-body font-sans">
                <span className="w-1 h-1 rounded-full bg-gold" />
                ventas@dennisjoyeros.com
              </p>
              <p className="flex items-center gap-2 text-[12px] text-content-body font-sans">
                <span className="w-1 h-1 rounded-full bg-gold" />
                (602) 661-0964 / +57 310 668 1990
              </p>
            </div>

            {/* Form */}
            <ContactForm />
          </div>

          {/* ─── Right Column: Image ─── */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-xl overflow-hidden shadow-elevation-lg aspect-[4/5]">
              <Image
                src="/demo/jewelry/jewel-004.jpg"
                alt="Joya en proceso de certificación"
                fill
                className="object-cover"
                sizes="50vw"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent h-32" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
