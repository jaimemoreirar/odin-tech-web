# CLAUDE.md — Instrucciones para construir el sitio web de Odin Tech

> Este archivo guía a Claude Code en la construcción completa del sitio web corporativo de **Odin Tech**, empresa chilena de servicios tecnológicos. Incluye decisiones de diseño, arquitectura de contenido, SEO técnico, estructura de archivos y estándares de código.

---

## 1. Contexto de la empresa

**Nombre:** Odin Tech  
**Dominio:** `odin-erp.cl`  
**País:** Chile  
**Idioma principal:** Español (es-CL)  
**Slogan:** *"Tecnología que piensa contigo"*

### Qué vende Odin Tech

- **Páginas web** — Sitios a medida según lo que el cliente quiere mostrar, vender o comunicar.
- **Apps a pedido** — Aplicaciones web desarrolladas según las especificaciones del cliente.
- **Software genérico propio:**
  - **Odin ERP** — Sistema de gestión para pymes. Control de ventas, inventario, pedidos y reportes en tiempo real. Estado: disponible.
  - **Odin Runa** — Análisis de conversaciones de WhatsApp mediante IA. Estado: próximamente.

> ⚠️ **NO existe Odin Analytics.** No agregar ni mencionar este producto.  
> ⚠️ **El nombre correcto es Odin Runa**, no "Odin Relaciones".

### Público objetivo

**Pymes chilenas, emprendedores, personas comunes y familias.** El segmento NO es tech. Son personas que no necesariamente saben de tecnología y no tienen por qué saber.

### Estado actual de la empresa

Odin Tech es una empresa nueva, en proceso de conseguir sus primeros clientes. **No se deben usar métricas, estadísticas ni logros inflados** ("120 clientes", "85 proyectos", "6 años de experiencia"). Solo se menciona lo que es real y verificable.

### Primer cliente real

**Dreamland Coffee & Gelato** — cafetería y heladería que usa Odin ERP. Beneficios reportados: estadísticas de ventas en tiempo real, gestión de pedidos e inventario. Su testimonio aparece en `index.html`.

### Tono de comunicación

**Cercano, simple y honesto.** Como un amigo que sabe de tecnología y te ayuda sin hacerte sentir ignorante.

**Reglas de tono obligatorias:**
- Sin siglas sin explicar: nada de SaaS, API, CI/CD, stack, arquitectura escalable, etc.
- Frases cortas. Verbos de acción directos.
- Hablarle al lector de "tú" o "vos" — nunca corporativo frío.
- No prometer cosas que la empresa no tiene. No inflar la historia.
- Usar lenguaje que una persona común entienda sin buscar en Google.

---

## 2. Paleta de colores corporativos

> **⚠️ Importante:** La paleta oficial de colores se encuentra en el archivo **`paleta_colores.txt`** en la carpeta raíz del proyecto. Antes de escribir cualquier línea de CSS, leer ese archivo y extraer los colores definidos ahí.

**Valores actuales mapeados (verificados desde paleta_colores.txt):**

```css
:root {
  --color-primary:    #6A1B9A;  /* Deep Orchid — morado base, color dominante de marca */
  --color-secondary:  #C2185B;  /* Vibrant Fuchsia — acento principal / CTA */
  --color-accent:     #00E5FF;  /* Point Cyan — acento de detalle / highlights */
  --color-gradient-1: #E91E63;  /* Luminous Magenta — punto medio del degradado */
  --color-gradient-2: #FF5722;  /* Sunset Orange — energía y llamadas a la acción */
  --color-gradient-3: #FFEB3B;  /* Sunlight Yellow — toque de energía máxima, usar con moderación */
  --color-bg:         #1A1A2E;  /* Cosmic Depth — fondo principal */
  --color-surface:    #212121;  /* Tech-Gray — superficie de tarjetas y paneles */
  --color-text:       #FFFFFF;  /* Blanco — texto principal sobre fondos oscuros */
  --color-text-muted: #9E9E9E;  /* Gris medio — texto secundario / subtítulos */
  --color-border:     rgba(106,27,154,0.35);  /* Morado translúcido — bordes sutiles */
  --color-white:      #FFFFFF;  /* Blanco puro — solo para uso puntual */
}
```

### Tipografía

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&family=JetBrains+Mono:wght@400;500&display=swap');

--font-display: 'Sora', sans-serif;       /* Headings y UI */
--font-body:    'Source Serif 4', serif;   /* Párrafos largos */
--font-mono:    'JetBrains Mono', mono;    /* Código / etiquetas tech */
```

---

## 3. Arquitectura del sitio

### Logo

> **⚠️ Importante:** El logo oficial está en la **carpeta raíz** como **`original_png.png`**. Usarlo desde ahí. No crear ni reemplazar.
> **⚠️ Usar siempre ruta relativa:** `src="original_png.png"` (sin barra inicial). La barra `/` falla cuando se abre el HTML directo en Chrome sin servidor.

- Navbar: `<img src="original_png.png" alt="Odin Tech" width="120" height="40">` — **height 62px en CSS**
- Footer: misma imagen — **height 56px en CSS**
- La navbar tiene `background: rgba(26,26,46,0.6)` con `backdrop-filter: blur(8px)` como estado base (no transparente).

**Logo en navbar:** el PNG tiene fondo blanco. Se usa una cápsula blanca redondeada para contenerlo intencionalmente:
```css
.navbar__logo img {
  height: 62px;
  background: rgba(255,255,255,0.96);
  border-radius: 8px;
  padding: 3px 4px;
}
.navbar__logo:hover img {
  background: rgba(255,255,255,1);
  box-shadow: 0 0 14px rgba(194,24,91,0.35);
}
```

**Logo en footer:** glow de marca con dos capas:
```css
.footer__brand img {
  height: 56px;
  filter: drop-shadow(0 0 10px rgba(194,24,91,0.55)) drop-shadow(0 0 22px rgba(106,27,154,0.35));
}
```

> Cuando se disponga de un PNG con fondo transparente: reemplazar `original_png.png`, eliminar el `background` de la cápsula navbar, y el glow del footer se verá aún mejor.

### Estructura de archivos

```
/
├── index.html
├── nosotros.html
├── productos.html
├── servicios.html
├── cursos.html
├── novedades.html
├── contacto.html
├── 404.html
├── original_png.png      # ← Logo oficial (NO mover ni renombrar)
├── paleta_colores.txt    # ← Paleta de colores oficial (leer antes de escribir CSS)
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/
│   │   ├── main.css          # Variables, reset, estilos globales
│   │   ├── components.css    # Componentes reutilizables
│   │   └── animations.css    # Keyframes y transiciones
│   ├── js/
│   │   ├── main.js           # Nav, scroll, cursor, stats counter, smooth scroll
│   │   ├── animations.js     # Intersection Observer, reveals, filtros tabs, acordeón
│   │   └── forms.js          # Validación y envío de formularios
│   └── img/
│       └── og-image.jpg      # 1200×630px para Open Graph (pendiente de crear)
└── .claude/
    └── launch.json           # Servidor local: npx serve -p 3000 .
```

### Páginas y su propósito

| Página | Propósito |
|---|---|
| `index.html` | Hero, propuesta de valor, productos, servicios, testimonio real, CTA |
| `nosotros.html` | Historia, misión, visión, valores, equipo |
| `productos.html` | Odin ERP y Odin Runa — descripciones y características |
| `servicios.html` | Páginas web, apps a pedido, software propio |
| `cursos.html` | Cursos online (si aplica en el futuro) |
| `novedades.html` | Blog y actualizaciones |
| `contacto.html` | Formulario de contacto, datos de contacto, WhatsApp |

---

## 4. Estado de construcción (sesión 2026-04-20)

### Archivos creados y funcionales

| Archivo | Estado | Notas |
|---|---|---|
| `assets/css/main.css` | ✅ | Variables CSS, reset, tipografía, grid, botones, utilidades, `.hero`, clases responsive custom |
| `assets/css/components.css` | ✅ | Navbar, footer, cards, badges, testimonios, CTA banner, WhatsApp float, loader, cursor. Footer con media queries mobile |
| `assets/css/animations.css` | ✅ | 12 keyframes, orbs hero, partículas, scroll indicator, reduced-motion |
| `assets/js/main.js` | ✅ | Loader, navbar scroll + hamburger, cursor personalizado, stats counter, smooth scroll, brand icons SVG |
| `assets/js/animations.js` | ✅ | `initScrollReveal()`, `initFilterTabs()`, `initAccordion()`, `initScrollIndicator()` |
| `assets/js/forms.js` | ✅ | `validateContactForm()`, `initContactForm()`, `initNewsletterForm()` |
| `index.html` | ✅ | Hero, propuesta de valor, productos, servicios, novedades, testimonio Dreamland, CTA, footer |
| `nosotros.html` | ✅ | Timeline real (2024–2026), misión/visión/valores, solo Jaime como fundador |
| `productos.html` | ✅ | Solo Odin ERP (disponible) + Odin Runa (próximamente). Filtros: Todos/ERP/NLP |
| `servicios.html` | ✅ | Acordeón: páginas web, apps a medida, capacitación productos, integraciones |
| `cursos.html` | ✅ | Reescrito: solo capacitación Odin ERP (disponible). Otros temas próximamente. Sin cursos inventados ni precios falsos |
| `novedades.html` | ✅ | Reescrito: sin Dreamland como featured. Artículos con tono humano. Featured: "Por qué creamos Odin Tech" |
| `contacto.html` | ✅ | Formulario completo. Ubicación: "Chile — atención 100% remota" |
| `404.html` | ✅ | Página de error con navegación |
| `robots.txt` | ✅ | Estándar |
| `sitemap.xml` | ✅ | 7 páginas |
| `assets/img/og-image.jpg` | ❌ | Pendiente — 1200×630px para Open Graph |
| `assets/img/favicon.svg` | ❌ | Pendiente — trazado desde original_png.png |

### Secciones actuales de index.html

1. **Navbar** — sticky, semitransparente siempre, glassmorphism al scroll, logo con cápsula blanca
2. **Hero** — slogan, subtítulo en lenguaje simple, botones "Ver servicios" + "Conversemos"
3. ~~Stats bar~~ — **eliminada** (números eran falsos)
4. **Propuesta de valor** — 3 cards: "Te hablamos en simple", "Hecho para ti", "Con soporte de verdad"
5. **Productos** — grid 2 columnas: Odin ERP (disponible) + Odin Runa (próximamente)
6. **Servicios** — 3 filas alternadas (clase `.services-row`): páginas web / apps a pedido / software listo
7. **Novedades** — editorial grid (clase `.editorial-grid`): artículo grande + 2 secundarios
8. **Testimonio** — 1 card centrada, Dreamland Coffee & Gelato, 5 estrellas, Odin ERP
9. **CTA final** — "¿Listo para que la tecnología trabaje para ti?"
10. **Footer** — brand + glow logo, empresa, productos (ERP + Runa), contacto

### Bugs y correcciones resueltas

| Problema | Causa | Solución |
|---|---|---|
| Logo no cargaba en Chrome | `src="/original_png.png"` con ruta absoluta fallaba sin servidor | Cambiado a `src="original_png.png"` (relativa) en todos los HTML |
| Logo se mimetizaba con el fondo oscuro | PNG con fondo blanco + colores oscuros similares al bg | Cápsula blanca redondeada en navbar; glow fucsia/púrpura en footer |
| Footer ocupaba media pantalla en mobile | `.footer__grid` sin media query para mobile | Añadido `@media (max-width: 768px)` con 1 columna y padding reducido |
| Sidebar novedades cortaba contenido | `grid-template-columns: 1fr 300px` sin breakpoint | Clase `.novedades-layout` colapsa a 1 columna en ≤1024px |
| Grids de servicios sin responsive | Inline styles sin media query | Clase `.services-row` con colapso a 1 columna en ≤768px |
| Grid artículos novedades sin responsive | Inline style `1fr 1fr` sin breakpoint | Clase `.articles-grid` colapsa a 1 columna en ≤640px |
| Featured article sin responsive | Inline style `1.2fr 1fr` sin breakpoint | Clase `.article-featured` colapsa a 1 columna en ≤768px |
| Grid contacto sin responsive | Inline style `1fr 1.4fr` sin breakpoint | Clase `.contacto-grid` colapsa a 1 columna en ≤768px |
| Navbar completamente transparente | Estado base sin background | Navbar con `rgba(26,26,46,0.6)` siempre activo |
| Hero sin padding-top | Clase `.hero` no definida en main.css | Añadido bloque `.hero` con `min-height:100vh; padding-top:var(--nav-height)` |
| Body invisible post-carga | `initLoader()` con DOMContentLoaded anidado | Llamada directa a `document.body.classList.add('loaded')` |
| Lucide sin íconos de marca | Lucide UMD excluye linkedin/github/instagram | `BRAND_ICONS` con SVG inline + `initBrandIcons()` en main.js |

### Clases responsive custom en main.css

| Clase | Uso | Colapsa en |
|---|---|---|
| `.services-row` | Filas de servicios en index.html | ≤768px → 1 columna |
| `.editorial-grid` | Grid novedades en index.html | ≤768px → 1 columna |
| `.novedades-layout` | Artículos + sidebar en novedades.html | ≤1024px → 1 columna |
| `.articles-grid` | Grid de artículos en novedades.html | ≤640px → 1 columna |
| `.article-featured` | Artículo destacado en novedades.html | ≤768px → 1 columna |
| `.contacto-grid` | Datos + formulario en contacto.html | ≤768px → 1 columna |

---

## 5. Reglas de contenido — obligatorias

### Lo que NUNCA debe aparecer en el sitio

- Métricas inventadas: clientes atendidos, proyectos entregados, años de experiencia (si no son reales)
- Productos inexistentes: **Odin Analytics no existe**
- Nombres incorrectos: "Odin Relaciones" → el nombre correcto es **Odin Runa**
- Tecnicismos sin explicar: SaaS, stack, arquitectura, CI/CD, APIs, microservicios
- Testimonios de empresas o personas inventadas

### Lo que SÍ debe aparecer

- Testimonio real de **Dreamland Coffee & Gelato** sobre Odin ERP (estadísticas en tiempo real, gestión de pedidos e inventario)
- Lenguaje que entiende cualquier persona sin conocimientos técnicos
- Propuestas honestas y alcanzables para una empresa nueva

---

## 6. Diseño visual — directrices

### Estética general

**Dirección:** *Nordic Modern Tech* — orden, geometría limpia, espacio generoso. Moderno, cercano, estético y confiable. No es un sitio de videojuegos ni fantasía.

**Elementos visuales clave:**
- Fondos oscuros `#1A1A2E` con gradientes suaves hacia `#212121`
- Degradado de marca: Deep Orchid → Vibrant Fuchsia → Magenta → Orange → Yellow
- Glassmorphism sutil solo en elementos flotantes (navbar, modales)
- Cian `#00E5FF` como acento de detalle — usar con moderación
- Espaciado generoso; el sitio respira

### Reglas que nunca se rompen

- **No blanco puro como fondo.** El sitio es dark-first (`#1A1A2E`).
- **No Inter, Roboto ni Arial.** Solo Sora, Source Serif 4 y JetBrains Mono.
- **No colores fuera de paleta.** Valores solo desde `paleta_colores.txt`.
- **No íconos de emoji en UI.** Solo Lucide Icons.
- **No glassmorphism excesivo.** Máximo 2–3 elementos por página.
- **No animaciones sin propósito.** Calidad sobre cantidad.

### Navbar

- Fondo base: `rgba(26, 26, 46, 0.6)` + `backdrop-filter: blur(8px)` — **siempre activo**, no solo al scroll
- Al scroll (>20px): aumenta opacidad y blur (`.navbar--scrolled`)
- Altura: `--nav-height: 84px`
- Logo: cápsula blanca redondeada (`background: rgba(255,255,255,0.96); border-radius: 8px; padding: 3px 4px`). Hover con glow fucsia.

### Hero section

- Full-viewport height (`min-height: 100vh`)
- `padding-top: var(--nav-height)` para no quedar bajo la navbar
- Título: `font-size: clamp(2rem, 5.5vw, 3.75rem)` en desktop; `clamp(1.8rem, 8vw, 2.5rem)` en mobile (`max-width: 768px`)
- Subtítulo en lenguaje simple, sin tecnicismos
- Dos CTAs: primario (degradado) + secundario (ghost)

---

## 7. Animaciones y microinteracciones

```css
--transition-fast:   150ms ease;
--transition-base:   300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow:   600ms cubic-bezier(0.22, 1, 0.36, 1);
```

- **Reveal al scroll:** `IntersectionObserver` + clase `.reveal` → `.visible`. Stagger de 100ms en grids.
- **Cursor personalizado:** Dot cian con lag suave. Solo en `pointer: fine`. Se expande en elementos interactivos.
- **Loader:** `document.body.classList.add('loaded')` directo en DOMContentLoaded (no anidar listeners).
- **Brand icons:** `initBrandIcons()` reemplaza `<i data-lucide="linkedin|github|instagram">` con SVG inline antes de que Lucide corra.

---

## 8. SEO técnico

### Metadatos base (en cada página)

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="[Descripción única por página, 150–160 caracteres]">
<meta name="author" content="Odin Tech">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://odin-erp.cl/[pagina]">
```

### Títulos por página

```
index.html     → Odin Tech | Tecnología que piensa contigo | Chile
nosotros.html  → Quiénes somos | Odin Tech
productos.html → Productos | Odin ERP y Odin Runa | Odin Tech
servicios.html → Servicios | Páginas web y apps a medida | Odin Tech
cursos.html    → Cursos online | Odin Tech
novedades.html → Novedades | Odin Tech
contacto.html  → Contacto | Odin Tech
```

### Reglas de headings

- Solo **un `<h1>` por página**
- `<h2>` para secciones principales, `<h3>` para cards y subsecciones
- Nunca saltar niveles

### Schema.org en index.html

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Odin Tech",
  "url": "https://odin-erp.cl",
  "logo": "https://odin-erp.cl/original_png.png",
  "description": "Empresa chilena de tecnología para pymes y personas: páginas web, aplicaciones a medida y software de gestión.",
  "slogan": "Tecnología que piensa contigo",
  "address": { "@type": "PostalAddress", "addressCountry": "CL" }
}
```

---

## 9. Performance y accesibilidad

- Imágenes: `loading="lazy"` en todas excepto above-the-fold. Siempre `width` + `height`.
- JS: todo con `defer`. Sin scripts bloqueantes en `<head>`.
- Sin frameworks pesados: HTML/CSS/JS vanilla.
- Contraste mínimo WCAG AA (4.5:1).
- Skip link como primer elemento del body.
- Formularios con `<label>` asociado a cada `<input>`.
- `prefers-reduced-motion` cubierto en animations.css.

---

## 10. Responsive design

```css
/* Mobile first */
/* xs: < 480px  — default */
/* sm: ≥ 480px  */ @media (min-width: 480px)  { }
/* md: ≥ 768px  */ @media (min-width: 768px)  { }
/* lg: ≥ 1024px */ @media (min-width: 1024px) { }
/* xl: ≥ 1280px */ @media (min-width: 1280px) { }
```

- Mobile: 1 columna, padding 16–20px
- Tablet: 2 columnas en grids
- Desktop: hasta 3 columnas, efectos completos
- Cursor personalizado solo en `pointer: fine`

---

## 11. Integraciones

- **Formulario de contacto:** `fetch` a endpoint Plumber API o Formspree como fallback.
- **WhatsApp flotante:** `https://wa.me/56936445396` — número real configurado.
- **Horario de atención:** Lunes a viernes · 9:00 – 19:00 (CLT)
- **Google Analytics 4:** placeholder comentado en `<head>` hasta tener ID real.
- **Servidor local:** `npx serve -p 3000 .` (configurado en `.claude/launch.json`)

---

## 12. Checklist de entrega

**Contenido**
- [x] Hero con lenguaje simple y sin tecnicismos
- [x] Stats bar eliminada (sin métricas falsas)
- [x] Productos corregidos: solo Odin ERP + Odin Runa (no Odin Analytics)
- [x] Servicios reescritos: páginas web, apps a pedido, software propio, capacitación
- [x] Testimonio real de Dreamland Coffee & Gelato en index.html
- [x] nosotros.html: timeline real, solo Jaime como fundador, sin equipo inventado
- [x] productos.html: filtros Todos/ERP/NLP, sin tabla de precios falsa
- [x] servicios.html: sin consultoría tecnológica, capacitación solo sobre productos propios
- [x] cursos.html: reescrito — solo Odin ERP disponible, sin cursos ni precios inventados
- [x] novedades.html: sin Dreamland como featured, artículos con tono humano
- [x] Footer con productos correctos (ERP + Runa) en todas las páginas
- [x] Logo: `href="index.html"` en todas las páginas (no `href="/"`
- [x] Logo: `src="original_png.png"` (ruta relativa, no absoluta con `/`)

**Visual y responsive**
- [x] Navbar semitransparente en estado base, altura 84px
- [x] Logo navbar: cápsula blanca + hover glow fucsia
- [x] Logo footer: glow fucsia/púrpura doble capa, 56px
- [x] `.hero` CSS con clamp() y padding-top correcto
- [x] Bug loader resuelto (DOMContentLoaded no anidado)
- [x] Brand icons (linkedin/github/instagram) con SVG inline
- [x] 6 clases responsive custom en main.css para todos los grids problemáticos
- [x] Footer mobile: 1 columna, gap y padding reducidos

**Pendiente**
- [ ] Crear `assets/img/og-image.jpg` (1200×630px)
- [ ] Crear favicon SVG desde `original_png.png`
- [ ] Logo con fondo transparente (PNG o SVG) — actualmente el PNG tiene fondo blanco
- [x] WhatsApp y teléfono: `+56936445396` en todos los archivos HTML
- [ ] Validación W3C sin errores
- [ ] Probar responsive en dispositivo real (375px, 768px, 1280px)

---

## 13. Deploy

**Repo:** https://github.com/jaimemoreirar/odin-tech-web (público)
**VPS ruta clone:** `/opt/odin-tech-web`
**VPS ruta sitio:** `/home/odin-erp/public_html`

### Flujo de trabajo

1. Hacer cambios en los archivos locales
2. **Siempre hacer commit + push** antes de indicar deploy
3. Entregar al usuario el comando de deploy para ejecutar en el VPS

### Comando de deploy (ejecutar en el VPS)

```bash
cd /opt/odin-tech-web && git pull && rsync -av --delete /opt/odin-tech-web/ /home/odin-erp/public_html/ && chown -R odin-erp:odin-erp /home/odin-erp/public_html/
```

---

*Este archivo es la fuente de verdad del proyecto. Ante cualquier duda de implementación, prevalece lo definido aquí.*
