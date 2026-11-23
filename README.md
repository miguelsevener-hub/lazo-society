# Lazo Society · web 2.0

Next.js 16 + Supabase, desplegada en Netlify desde GitHub. Dominio y DNS en GoDaddy.

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
2. **Supabase:** las tablas ya están creadas en el esquema `lazo` del proyecto existente, aisladas de lo demás (se borra entero con `drop schema lazo cascade;`). Falta un paso: Project Settings → Data API → Exposed schemas → añadir `lazo`.
3. **Netlify:** Add new site → Import from GitHub → `lazo-society`. Netlify detecta Next.js solo.
   En Site settings → Environment variables, añadir las de `.env.example`:
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (secreta) y `NEXT_PUBLIC_SITE_URL=https://lazosociety.com`.
4. **Dominio (se queda en GoDaddy, sin Cloudflare):**
   - En Netlify → Domain management → Add domain → `lazosociety.com` (y `www.lazosociety.com`). Marcar `www` como dominio principal.
   - En GoDaddy → Dominio → DNS, cambiar solo estos dos registros:
     - `A` con nombre `@` → `75.2.60.5` (el balanceador de Netlify). Borrar cualquier otro registro `A` de `@`.
     - `CNAME` con nombre `www` → `lazosociety.netlify.app`.
   - No tocar los registros `MX` ni `TXT` (correo y verificaciones).
   - El HTTPS lo activa Netlify solo cuando los registros se propagan (de minutos a un día).

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
