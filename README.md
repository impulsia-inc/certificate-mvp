# FYN — Plataforma de Certificación y Verificación de Joyas

Plataforma web de nivel empresarial desarrollada para **FYN**, diseñada para la emisión, gestión y verificación pública instantánea de certificados de autenticidad para joyas de alta gama.

---

## 🌟 Características Principales

### 🔍 Portal Público de Verificación
- **Búsqueda Directa por Referencia:** Consulta pública inmediata introduciendo la referencia de certificado (ej. `FYN-26-000001`).
- **Verificación Completa:** Visualización detallada de especificaciones de la pieza (materiales, pureza, peso en gramos, tipo de metal, gemas, quilates, claridad, color, número de serie).
- **Descarga de Documento Oficial:** Descarga directa del certificado PDF autenticado.
- **Manejo Transparente de Estados:**
  - ✅ **Certificado Activo:** Muestra la insignia verde de autenticidad y ficha técnica completa.
  - ⛔ **Certificado Revocado:** Muestra advertencia clara indicando la causa y fecha de revocación.
  - ❓ **No Encontrado:** Sugerencias y estado limpio si la referencia no existe.

### 💼 Panel de Administración Empresarial
- **Acceso Protegido:** Autenticación segura mediante cookies firmadas e incriptadas y contraseñas hasheadas con `bcrypt`.
- **Dashboard Resumen:** Métricas en tiempo real de certificados totales, activos, revocados y borradores.
- **Gestión Completa de Certificados (CRUD):**
  - Creación con autogeneración de referencia única (`FYN-YY-NNNNNN`).
  - Edición flexible de especificaciones de joya y certificado.
  - Revocación y reactivación instantánea con justificación.
  - Sistema de borradores y publicación.
- **Búsqueda y Filtros en Tiempo Real:** Tabla interactiva para filtrar por referencia, nombre de pieza, material o categoría.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 16.3.5](https://nextjs.org/) (App Router, Server Actions, React Server Components)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/)
- **Librería UI:** [React 19](https://react.dev/)
- **Estilos & Diseño:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design System (`stone` palette & `champagne gold #C9A96E`)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Formularios & Validación:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Tablas Interactivas:** [@tanstack/react-table v8](https://tanstack.com/table/v8)
- **Seguridad:** `bcryptjs`
- **Iconos:** [Lucide React](https://lucide.dev/)

---

## 🚀 Inicio Rápido

### 1. Requisitos
- Node.js v18.17+ / Node.js v20+
- npm v9+

### 2. Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd v0-jewerly-certi-system

# Instalar dependencias
npm install
```

### 3. Configuración de Entorno
Copiar el archivo de entorno de ejemplo:
```bash
cp .env.example .env.local
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```
Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## 🔑 Credenciales de Demostración (Admin)

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin@fyn-demo.com` | `FYNDemo2026!` | Administrador FYN |

---

## 💎 Referencias de Certificados para Probar en Demostración

| Referencia | Estado | Descripción de Pieza |
|---|---|---|
| `FYN-26-000001` | ✅ Activo | Anillo de Compromiso con Diamante (Oro 18K) |
| `FYN-26-000002` | ✅ Activo | Cadena Eslabón Cubano (Oro 24K, 45.8g) |
| `FYN-26-000003` | ✅ Activo | Pulsera Esmeralda Colombiana (Platino 950) |
| `FYN-26-000004` | ✅ Activo | Aretes Zafiro Azul (Oro 18K) |
| `FYN-26-000005` | ✅ Activo | Anillo Solitario con Rubí (Oro Blanco 14K) |
| `FYN-26-000006` | ✅ Activo | Cadena Veneciana de Plata (Plata 925) |
| `FYN-26-000007` | ⛔ Revocado | Pulsera Tenis Diamantes (Revocado por pérdida) |
| `FYN-26-000008` | 📝 Borrador | Aretes Esmeralda en Oro Rosado (En edición) |

---

## 🏛️ Arquitectura & Documentación

Toda la documentación técnica se encuentra organizada en el directorio `docs/`:

- 📐 [Arquitectura del Sistema](docs/architecture.md) — Explicación detallada de la arquitectura en capas y el patrón repositorio.
- 🗄️ [Modelo de Datos & Drizzle ORM](docs/data-model.md) — Entidades, relaciones y esquema listo para PostgreSQL.
- 💻 [Guía de Desarrollo](docs/development.md) — Estándares de código, scripts y flujo de trabajo.
- 📄 [Plan de Generación de PDFs](docs/future-certificate-generation.md) — Hoja de ruta para generación dinámica de PDFs con QR.

---

## 📄 Licencia & Aviso Legal

Desarrollado para **FYN** como demostración de plataforma de certificación. Todos los documentos de prueba generados incluyen marcas de demostración sin validez comercial ni legal real.
