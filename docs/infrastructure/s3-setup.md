# Upload de imágenes — Modo dual (local + S3)

El sistema detecta automáticamente el modo según las variables de entorno:

- **Sin credenciales AWS** (desarrollo local) → guarda en `public/uploads/<folder>/`
- **Con credenciales AWS** (producción) → sube a S3

El cambio es transparente para el admin: el componente `ImageUploader` usa el mismo endpoint
`/api/admin/upload` y recibe una URL (relativa en dev, absoluta a S3 en prod).

---

## Desarrollo local (sin S3)

Sin configurar nada, los uploads se guardan en `/public/uploads/<folder>/<timestamp>-<random>.<ext>`
y Next.js los sirve bajo `http://localhost:3002/uploads/...`.

El directorio está en `.gitignore` para evitar commits de imágenes de prueba.

---

## Producción con S3

## Variables de entorno requeridas

En `.env.local` (solo para producción o para probar S3 localmente):

```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=nivelics-media
AWS_S3_PUBLIC_URL=https://nivelics-media.s3.us-east-1.amazonaws.com
```

Si usas CloudFront, apunta `AWS_S3_PUBLIC_URL` al dominio del distribution.

---

## Configuración del bucket S3 (`nivelics-media`)

### 1. Block Public Access

**OFF** — el bucket debe servir imágenes públicamente via GET.

### 2. Bucket Policy

Permitir lectura pública de objetos:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::nivelics-media/*"
    }
  ]
}
```

### 3. CORS

Permitir uploads directos desde el navegador:

```json
[
  {
    "AllowedOrigins": [
      "https://nivelics.com",
      "https://www.nivelics.com",
      "http://localhost:3000",
      "http://localhost:3002"
    ],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedHeaders": ["Content-Type", "Cache-Control"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 4. IAM Policy para el usuario de upload

El `AWS_ACCESS_KEY_ID` del admin necesita permisos para generar presigned URLs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:PutObjectAcl", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::nivelics-media/*"
    }
  ]
}
```

### 5. Lifecycle Rules (opcional)

Para folders temporales:

- `/temp/*` → Glacier después de 30 días
- Resto de folders (blog, casos, servicios, etc.) → sin lifecycle

---

## Estructura de carpetas

El admin organiza los uploads en estas carpetas dentro del bucket:

| Carpeta            | Uso                                   |
| ------------------ | ------------------------------------- |
| `blog/`            | Imágenes de artículos del blog        |
| `casos/`           | Logos y covers de casos de éxito      |
| `servicios/`       | Covers de servicios y subservicios    |
| `industrias/`      | Covers de páginas de industrias       |
| `landing-pages/`   | Imágenes de bloques de landing pages  |
| `team/`            | Fotos del equipo                      |
| `certificaciones/` | Logos de certificaciones              |
| `home/`            | Hero image y trust bar logos del home |
| `nav/`             | Logos y imágenes de navegación        |
| `og/`              | OG images para SEO                    |
| `general/`         | Otros archivos                        |

Formato del key: `<folder>/<timestamp>-<random>.<ext>`

---

## Flujo de upload

1. Usuario selecciona archivo en `ImageUploader`
2. Cliente hace `POST /api/admin/upload` con `{ folder, contentType, sizeBytes }`
3. API valida token JWT del admin y genera presigned PUT URL (5 min de vida)
4. Cliente sube el archivo directamente a S3 via PUT (sin pasar por el server)
5. Cliente recibe la URL pública y la guarda en la DB vía el form

## Límites

- **Tamaño máximo**: 10 MB por archivo
- **Tipos permitidos**: JPEG, PNG, WebP, GIF, AVIF, SVG
- **TTL del presigned URL**: 5 minutos
- **Cache-Control**: `public, max-age=31536000, immutable` (los archivos nunca expiran)
