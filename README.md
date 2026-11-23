# Lazo Society · web 2.0

Next.js 16 + Supabase, desplegada en Netlify desde GitHub. DNS en Cloudflare.

## Qué hay

| Ruta | Qué es |
| --- | --- |
| `/` | Portada: manifiesto, cómo funciona, los seis animales y los packs |
| `/pedir` | Pedido de la pareja: calcula el pack según los solteros (sin cobro online todavía) |
| `/b/[slug]` | Página de cada boda, con cuenta atrás y acceso al test |
| `/b/[slug]/test` | Test previo: el animal queda guardado para el sobre, no se enseña |
| `/b/[slug]/ahora` | Test en la boda (QR del cartel): enseña el animal y manda a la cesta |
| `/test` | Test público para redes: enseña el animal y ofrece unirse a la Society |

La lógica del test está en `lib/test.ts` y las preguntas en `lib/preguntas.ts`, generadas desde el simulador (`2.0/simulador`).
`npm test` comprueba que la web da exactamente el mismo animal que el simulador, que los espejos son simétricos y que los packs salen bien.

## Puesta en marcha

1. **GitHub:** crear el repositorio `lazo-society` (privado) y subir esta carpeta.
2. **Supabase:** en el proyecto, SQL Editor → pegar y ejecutar `supabase/migrations/0001_inicio.sql`.
3. **Netlify:** Add new site → Import from GitHub → `lazo-society`. Netlify detecta Next.js solo.
   En Site settings → Environment variables, añadir las de `.env.example`:
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (secreta) y `NEXT_PUBLIC_SITE_URL=https://lazosociety.com`.
4. **Cloudflare (DNS):**
   - Add a site → `lazosociety.com` → plan Free. Cloudflare copia los registros que haya en GoDaddy.
   - En GoDaddy → Dominio → Nameservers → "Usar los míos" → poner los dos nameservers que da Cloudflare.
   - En Cloudflare → DNS: `CNAME @ → <tu-sitio>.netlify.app` y `CNAME www → <tu-sitio>.netlify.app`, con la nube en gris (solo DNS).
   - En Netlify → Domain management → añadir `lazosociety.com` y `www.lazosociety.com`. El HTTPS se activa solo.
   - Antes de cambiar los nameservers, comprobar en GoDaddy si hay registros MX (correo) y que Cloudflare los ha copiado.

## Seguridad y datos

- Todo se lee y escribe desde el servidor con la clave `service_role`. Las tablas tienen RLS activado sin políticas públicas.
- El test exige mayoría de edad y consentimiento. Unirse a la Society es un consentimiento aparte.
- La pareja solo ve el censo agregado (vista `censo`), nunca respuestas individuales.
- Pendiente: borrado automático de los datos de cada boda unos meses después (salvo quien se unió a la Society). Revisar todo con un abogado.

## Recalibrar el test

Tras el piloto y cada 1.000 tests reales: exportar `respuestas` de la tabla `solteros`, pasar por `calibrar()` en `lib/test.ts`
y sustituir `CALIBRACION`. La versión queda guardada en cada test (`calibracion`).

## Pendiente

- Cobro online (Stripe) cuando toque.
- Generación automática de los PDF de producción (sobres, chapas, cartel con QR) al cerrar el test.
- Emails (enlace para los solteros, recordatorio antes del cierre).
- Panel para la pareja y el wedding planner.
- Escenas de color y dibujos de línea nuevos cuando estén aprobados.
