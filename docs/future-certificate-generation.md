# FYN — Plan de Generación Dinámica de Certificados PDF

Especificación técnica para implementar la generación dinámica de certificados oficiales en formato PDF con firma digital y marca de agua en fases futuras.

---

## 1. Contexto y Objetivos

En el MVP actual, la plataforma permite adjuntar y consultar archivos PDF precargados o subidos manualmente por el administrador.

Para la versión comercial v1.0, el sistema debe:
1. Generar automáticamente un PDF oficial de alta resolución al publicar una certificación (`status = 'active'`).
2. Incorporar plantilla visual institucional de FYN (tipografía serif, bordes finos dorados/champán, códigos QR).
3. Incluir un Código QR escaneable que redirija directamente a la URL de verificación pública:
   `https://fyn.com/verificar/FYN-26-XXXXXX`
4. Aplicar firma criptográfica o marca de agua para certificar autenticidad anti-falsificación.

---

## 2. Opciones de Implementación Evaluadas

### Opción A: `@react-pdf/renderer` (Recomendada)
- **Ventajas:** Permite construir el diseño del PDF utilizando componentes JSX (`<Document>`, `<Page>`, `<View>`, `<Text>`, `<Image>`). Se ejecuta tanto en Node.js Serverless/Edge como en el cliente. Alta velocidad sin depender de un navegador headless.
- **Caso de uso:** Ideal para generar certificados limpios, livianos (100KB-300KB) y estandarizados.

### Opción B: Puppeteer / Playwright + HTML/Tailwind
- **Ventajas:** Renderiza HTML/CSS exacto utilizando Chromium headless. Permite utilizar estilos complejos de Tailwind CSS, sombras y canvas.
- **Desventajas:** Requiere entorno Node.js completo o servicio externo (ej. Browserless.io / Cloudflare Browser Rendering), mayor consumo de RAM y tiempo de ejecución (1.5s - 3s por PDF).

---

## 3. Arquitectura del Generador Dinámico

```
┌───────────────────────────┐
│ Server Action             │
│ (publishCertificate)      │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ CertificatePdfGenerator   │
│ (@react-pdf/renderer)     │
└─────────────┬─────────────┘
              │ (Genera Buffer PDF)
              ▼
┌───────────────────────────┐
│ StorageService            │
│ (Cloudflare R2 / S3)      │
└─────────────┬─────────────┘
              │ (Retorna URL / StorageKey)
              ▼
┌───────────────────────────┐
│ CertificateFile           │
│ (Registra tipo 'pdf')     │
└───────────────────────────┘
```

---

## 4. Código Ejemplo con `@react-pdf/renderer`

Ejemplo conceptual del componente de PDF oficial:

```tsx
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import type { CertificateDetail } from '@/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FAF9F6',
    fontFamily: 'Helvetica',
  },
  borderFrame: {
    border: '2pt solid #C9A96E',
    padding: 30,
    height: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1C1917',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#78716C',
    marginTop: 4,
  },
  referenceBadge: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#C9A96E',
    textAlign: 'center',
    marginVertical: 15,
  },
  grid: {
    flexDirection: 'row',
    marginTop: 20,
  },
  col: {
    width: '50%',
  },
  label: {
    fontSize: 8,
    color: '#A8A29E',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 11,
    color: '#1C1917',
    marginBottom: 10,
  },
});

export function CertificatePdfTemplate({ certificate }: { certificate: CertificateDetail }) {
  const { jewelry } = certificate;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.borderFrame}>
          <View style={styles.header}>
            <Text style={styles.title}>FYN</Text>
            <Text style={styles.subtitle}>CERTIFICADO OFICIAL DE AUTENTICIDAD Y PROPIEDAD</Text>
          </View>

          <Text style={styles.referenceBadge}>REFERENCIA: {certificate.reference}</Text>

          <View style={styles.grid}>
            <View style={styles.col}>
              <Text style={styles.label}>Pieza</Text>
              <Text style={styles.value}>{jewelry.name}</Text>

              <Text style={styles.label}>Categoría</Text>
              <Text style={styles.value}>{jewelry.category}</Text>

              <Text style={styles.label}>Material</Text>
              <Text style={styles.value}>{jewelry.material || 'N/A'}</Text>

              <Text style={styles.label}>Peso</Text>
              <Text style={styles.value}>{jewelry.weight ? `${jewelry.weight} ${jewelry.weightUnit || 'g'}` : 'N/A'}</Text>
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Piedra Preciosa</Text>
              <Text style={styles.value}>{jewelry.stoneType || 'Sin gema principal'}</Text>

              <Text style={styles.label}>Peso de Piedra</Text>
              <Text style={styles.value}>{jewelry.stoneWeight ? `${jewelry.stoneWeight} ct` : 'N/A'}</Text>

              <Text style={styles.label}>Fecha de Emisión</Text>
              <Text style={styles.value}>{new Date(certificate.issuedAt).toLocaleDateString('es-ES')}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
```

---

## 5. Próximos Pasos para v1.0 Commercial

1. Instalar `@react-pdf/renderer` y `qrcode`.
2. Crear endpoint API o función serverless que reciba `certificateId`, genere el buffer PDF y lo suba automáticamente al almacenamiento del cliente.
3. Almacenar el enlace público en la entidad `CertificateFile`.
