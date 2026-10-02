# 45 Minutes Plumbing Supply — App web instalable (PWA)

Prototipo navegable listo para subir a cualquier hosting estático. Al abrirlo en el celular se puede
agregar a la pantalla de inicio y queda como app, con el logo de la marca y el nombre **45 Minutes**.

## Contenido
```
45minutes-app/
├── index.html              App completa (HTML + CSS + JS, sin dependencias)
├── manifest.webmanifest    Nombre, colores e íconos para Android/Chrome
├── sw.js                   Service worker: instalación y funcionamiento offline
├── favicon.ico
├── .htaccess               Solo para Apache/cPanel (fuerza HTTPS y tipo MIME del manifest)
├── assets/                 logo, van, tienda, obra
└── icons/                  icon-192, icon-512, icon-maskable-512, apple-touch-icon, favicon-32
```

## Cómo subirlo
1. Sube **el contenido de la carpeta** (no el zip) a la raíz del dominio o a una subcarpeta
   (ej. `https://app.45minutesplumbing.com/` o `https://tudominio.com/45minutes/`). Las rutas son relativas.
2. **HTTPS es obligatorio**: sin HTTPS el celular no ofrece instalarla como app.
3. Opciones rápidas: Netlify Drop (arrastrar la carpeta), Vercel, Cloudflare Pages, S3 + CloudFront o cPanel.

## Cómo se instala en el celular
- **iPhone (Safari):** abrir el link → botón Compartir → *Agregar a pantalla de inicio*. La app muestra un aviso con estas instrucciones.
- **Android (Chrome):** aparece "Instalar app" automáticamente, o menú ⋮ → *Agregar a pantalla principal*.

## Cambios frecuentes
- **Nombre bajo el ícono:** `short_name` en `manifest.webmanifest` y `apple-mobile-web-app-title` en `index.html`
  (máx. ~12 caracteres; nombres más largos se cortan).
- **Íconos:** reemplaza los PNG de `/icons` con el mismo nombre y tamaño.
- **Al subir una versión nueva:** cambia `CACHE_VERSION` en `sw.js` (ej. `45min-v2`); si no, los celulares que ya la instalaron pueden seguir viendo la anterior.
- **Velocidad de la demo de tracking:** `DEMO_SPEED` en `index.html` (30 = 38 min simulados en ~76 segundos).

## Importante
Es un prototipo para presentación: catálogo, precios, cliente Pro, conductor y tiempos son datos de demostración.
No hay backend, pagos ni envío real de pedidos o solicitudes.
