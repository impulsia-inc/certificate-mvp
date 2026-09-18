# FYN — Guía de Desarrollo Local

Instrucciones y recomendaciones para configurar, ejecutar y colaborar en la plataforma **FYN**.

---

## 1. Requisitos Previos

- **Node.js**: v18.17.0 o superior (recomendado v20+ LTS).
- **npm**: v9.0.0 o superior.

---

## 2. Configuración Inicial

1. **Clonar e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Variables de Entorno:**
   Copiar `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Contenido predeterminado de `.env.local`:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ADMIN_EMAIL=admin@fyn-demo.com
   # Hash bcrypt para "FYNDemo2026!"
   ADMIN_PASSWORD_HASH=$2b$10$z8WjOXWdj6UMGgF3yzVRQ.LR6YtsMyRC62xxRAhrXW.nZosBh2pn6
   SESSION_SECRET=fyn-super-secret-key-32-chars-minimum!
   ```

---

## 3. Scripts Disponibles

| Comandos | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Compila la aplicación para producción |
| `npm start` | Inicia el servidor de producción |
| `npx tsc --noEmit` | Verifica errores de tipos de TypeScript |
| `npx eslint .` | Ejecuta el linter sobre el proyecto |
| `node scripts/generate-demo-pdfs.mjs` | Regenera los PDFs de demostración |

---

## 4. Credenciales de Demostración

Para acceder al panel administrativo (`/admin` o `/login`):
- **Email:** `admin@fyn-demo.com`
- **Contraseña:** `FYNDemo2026!`

---

## 5. Estructura de Referencias de Certificados

El generador automático (`src/lib/reference/generator.ts`) asigna identificadores con el estándar:
`FYN-YY-NNNNNN`
- `FYN`: Prefijo institucional.
- `YY`: Año de emisión (ej. `26` para 2026).
- `NNNNNN`: Secuencial formateado a 6 dígitos con ceros a la izquierda (ej. `000001`).

---

## 6. Flujo de Trabajo para Nuevas Funcionalidades

1. **Modelado y Tipos:** Agregar interfaces en `src/types/index.ts`.
2. **Esquema Zod:** Definir la validación de entrada en `src/features/certificates/schemas/`.
3. **Métodos de Repositorio:** Añadir la firma a `ICertificateRepository` y su correspondiente implementación en `MockCertificateRepository`.
4. **Capa de Servicios & Server Actions:** Exponer la operación mediante Server Actions con retorno typed (`ActionResult<T>`).
5. **Componente / Vista:** Diseñar la UI en Next.js siguiendo el sistema de diseño de FYN.
