# FYN — Arquitectura del Sistema

Este documento describe la arquitectura de software de la plataforma de certificación y verificación de joyas **FYN**, diseñada para ser modular, desacoplada y lista para migrar a producción con PostgreSQL y almacenamiento S3/R2 sin reescribir la capa de presentación.

---

## 1. Visión General de la Arquitectura

El sistema utiliza una arquitectura por capas basada en los principios de **Clean Architecture** y **Domain-Driven Design (DDD)** simplificado.

```
┌─────────────────────────────────────────────────────────┐
│                      CAPA DE VISTAS                     │
│  (Next.js App Router: React Server & Client Components) │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   CAPA DE SERVICIOS                     │
│       (CertificateService, StorageService, AuthService)  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 CAPA DE REPOSITORIOS                    │
│   (ICertificateRepository ──► MockCertificateRepository)│
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 ALMACENAMIENTO DE DATOS                 │
│         (In-Memory Mock / Futuro PostgreSQL+Drizzle)    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Decisiones Arquitectónicas Clave

### 2.1 Next.js 16 App Router & React Server Components (RSC)
- **RSC por Defecto:** Todas las páginas de consulta pública (`/verificar/[reference]`) y vistas del dashboard administrativo se renderizan en el servidor para máxima velocidad y SEO.
- **Client Components Scoped:** Los componentes interactivos (formularios con `react-hook-form`, tablas con filtros, diálogos de confirmación) se marcan con `'use client'` y se mantienen en los bordes de la aplicación.
- **Server Actions:** La mutación de datos se maneja exclusivamente a través de Server Actions (`src/features/certificates/actions/certificate.actions.ts`), eliminando la necesidad de APIs REST/GraphQL intermedias para operaciones internas.

### 2.2 Patrón Repositorio (Repository Pattern)
Toda interacción con la fuente de datos está abstraída detrás de la interfaz `ICertificateRepository` (`src/features/certificates/repositories/certificate.repository.ts`).

Actualmente, la implementación por defecto es `MockCertificateRepository`, que maneja datos en memoria con persistencia en el ciclo de vida de la aplicación.

**Plan de Migración a Producción:**
1. Crear `DrizzleCertificateRepository` implementando `ICertificateRepository`.
2. Actualizar la fábrica en `src/features/certificates/repositories/index.ts` para instanciar la clase de Drizzle en producción.
3. Cero cambios requeridos en la capa de vistas o Server Actions.

### 2.3 Servicio de Almacenamiento de Archivos (Storage Service)
La subida y consulta de archivos (PDFs de certificados e imágenes de joyas) está abstraída tras `IStorageService`.

- **Entorno Actual:** `LocalStorageService` guarda y sirve archivos en el sistema de archivos local (`public/uploads/` y `/demo/`).
- **Producción:** Implementar `R2StorageService` o `S3StorageService` conectando a Cloudflare R2 o AWS S3 mediante el SDK de AWS v3.

### 2.4 Middleware y Seguridad (`proxy.ts`)
Con las especificaciones de Next.js 16:
- La protección de rutas administrativas `/admin/*` se realiza en `src/proxy.ts` (función `proxy`).
- Verificación de sesión mediante cookies HTTP-only encriptadas/firmadas.
- Contraseñas administrativas protegidas con **bcrypt** (`bcryptjs`).

---

## 3. Estructura del Código Fuente

```
src/
├── app/                        # Rutas de Next.js App Router
│   ├── (public)/              # Rutas públicas (Home, Verificar)
│   ├── (auth)/                # Rutas de autenticación (Login)
│   ├── (admin)/               # Rutas administrativas protegidas (/admin)
│   ├── api/                   # API Route Handlers (Servicio de archivos)
│   ├── globals.css            # Sistema de diseño de FYN
│   └── layout.tsx             # Root layout
├── components/                 # Componentes React reutilizables
│   ├── ui/                    # Componentes de diseño (shadcn/ui)
│   ├── public/                # Componentes específicos de vista pública
│   ├── admin/                 # Componentes específicos del admin
│   ├── certificates/          # Componentes de dominio de certificados
│   └── shared/                # Componentes genéricos (PageHeader, EmptyState, etc.)
├── features/certificates/      # Módulo funcional de Certificados
│   ├── actions/               # Server Actions
│   ├── repositories/          # Interfaces e implementaciones de repositorio
│   ├── schemas/               # Validaciones Zod
│   └── services/              # Lógica de negocio (CertificateService)
├── lib/                        # Infraestructura y utilidades
│   ├── auth/                  # Servicio de Autenticación
│   ├── storage/               # Servicio de Almacenamiento de Archivos
│   ├── reference/             # Generador de referencias únicas
│   └── utils.ts               # Utilidades generales (cn, etc.)
├── data/mock/                  # Datos de demostración enriquecidos
└── types/                      # Definiciones de TypeScript
```
