import React from "react";
import { Search, Shield, FileText, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Encuentra tu referencia",
      description: "Localiza el número de referencia único (ej. FYN-26-000001) impreso en tu documento de certificación físico."
    },
    {
      number: "02",
      icon: Shield,
      title: "Verifica tu certificación",
      description: "Ingresa el número en nuestra plataforma segura para validar la autenticidad de la pieza."
    },
    {
      number: "03",
      icon: FileText,
      title: "Consulta la información",
      description: "Accede a los detalles completos: materiales, peso, pureza, piedras preciosas y más características."
    },
    {
      number: "04",
      icon: Download,
      title: "Descarga tu documento",
      description: "Obtén una copia digital en PDF de tu certificado para tus registros personales."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tight mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-stone-500 text-lg">
            Un proceso simple y seguro para verificar la autenticidad de tu joyería fina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
          {/* Decorative connector line on desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-stone-200 pointer-events-none" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-8 relative z-10 border border-stone-100 group-hover:border-[#C9A96E]/30 group-hover:bg-[#C9A96E]/5 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-stone-700 group-hover:text-[#C9A96E] transition-colors" strokeWidth={1.5} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-xs font-bold text-[#C9A96E] font-serif shadow-sm">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-stone-900 mb-3">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
