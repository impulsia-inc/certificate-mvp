'use client';

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('submitting');

    // Simulate submission (MVP — no backend endpoint yet)
    setTimeout(() => {
      setFormState('success');
    }, 1200);
  }

  if (formState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h4 className="text-[18px] font-semibold font-sans text-content-titleDesktop">
          ¡Mensaje enviado!
        </h4>
        <p className="text-[14px] text-content-body font-sans max-w-sm">
          Nos pondremos en contacto contigo lo antes posible. Gracias por tu interés.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre y Apellido */}
      <div>
        <label htmlFor="contact-name" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-content-muted font-sans mb-2">
          Nombre y Apellido
        </label>
        <input
          id="contact-name"
          type="text"
          required
          placeholder="Carlos Mendoza de Silva"
          className="w-full h-11 px-4 text-[14px] font-sans text-content-titleDesktop bg-white border border-[#E9E8E3] rounded-md focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-content-placeholder transition-all"
        />
      </div>

      {/* Teléfono / Email - row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-phone" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-content-muted font-sans mb-2">
            Teléfono Celular
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            placeholder="+57 310 000 0000"
            className="w-full h-11 px-4 text-[14px] font-sans text-content-titleDesktop bg-white border border-[#E9E8E3] rounded-md focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-content-placeholder transition-all"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-content-muted font-sans mb-2">
            Correo Electrónico
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="correo@ejemplo.com"
            className="w-full h-11 px-4 text-[14px] font-sans text-content-titleDesktop bg-white border border-[#E9E8E3] rounded-md focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-content-placeholder transition-all"
          />
        </div>
      </div>

      {/* Descripción / Mensaje */}
      <div>
        <label htmlFor="contact-message" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-content-muted font-sans mb-2">
          Descripción / Mensaje
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          placeholder="Indíquenos cómo podemos ayudarle: gema o joya a certificar, y cualquier requerimiento en específico."
          className="w-full px-4 py-3 text-[14px] font-sans text-content-titleDesktop bg-white border border-[#E9E8E3] rounded-md focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-content-placeholder transition-all resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="inline-flex items-center justify-center gap-2 h-11 px-7 bg-brandBlue-action hover:bg-brandBlue-action/90 text-white text-[12px] font-semibold tracking-[0.1em] uppercase rounded-md transition-all disabled:opacity-60 disabled:cursor-not-allowed font-sans shadow-btn-login"
      >
        {formState === 'submitting' ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Enviar Mensaje / Solicitar Cita
          </>
        )}
      </button>
    </form>
  );
}
