# Especificación: Cotizador Interactivo ODIN Tech

*Versión: 1.1 — Estado: Listo para Claude Code*  
*Destino: Brief de implementación para Claude Code*

---

## 1. Concepto General

### ¿Qué es?
Un cotizador interactivo embebido en el sitio web de ODIN Tech (HTML/CSS/JS vanilla) que guía al usuario mediante preguntas de selección por click — sin formularios largos, sin jerga técnica — hasta recomendarle el producto que mejor calza con su necesidad, mostrando el precio correspondiente. Al final, el usuario puede enviar la cotización a ODIN Tech junto con sus datos de contacto.

### ¿Para qué sirve?
- **Para el usuario:** Obtener una recomendación clara y un precio orientativo sin necesidad de llamar ni escribir primero. Reduce la fricción del primer contacto.
- **Para ODIN Tech:** Capturar leads calificados con contexto previo (qué necesitan, qué presupuesto esperan, qué producto les fue recomendado), antes de la llamada o reunión de diagnóstico.

### ¿Dónde vive?
En una sección propia del sitio web actual (`#cotizador` o página `/cotizar`). Puede ser invocado desde un CTA del hero o del menú de navegación. Se implementa como un módulo autocontenido: un archivo `cotizador.html` (o sección en `index.html`) + `cotizador.js` + estilos integrados al `style.css` existente.

---

## 2. Flujo de Usuario

El cotizador funciona como un **wizard de pasos secuenciales**. Cada paso presenta una pregunta simple con opciones visuales (tarjetas o botones grandes). Al hacer click en una opción, avanza automáticamente al siguiente paso — sin botón "Siguiente", la selección misma avanza.

### Paso 1 — ¿Qué necesita tu negocio?
> Pregunta raíz que bifurca hacia los 3 productos.

**Opciones (tarjetas con ícono + título + descripción corta):**

| Opción | Descripción visible | Rama que activa |
|--------|---------------------|-----------------|
| 🌐 Presencia en internet | "Quiero que mis clientes me encuentren online" | → Flujo Páginas Web |
| ⚙️ Una aplicación para mi negocio | "Quiero digitalizar o automatizar procesos internos" | → Flujo Aplicaciones |
| 🔗 Conectar herramientas que ya uso | "Tengo sistemas que no se hablan entre sí" | → Flujo Integración |

---

### Rama A — Páginas Web

**Paso A1 — ¿Cuál es el objetivo principal de tu sitio?**

| Opción | Descripción | Señal de precio |
|--------|-------------|-----------------|
| Que me contacten / pidan información | Una sola página, directo al grano | → Landing Page |
| Mostrar mis servicios con varias secciones | Mini-sitio ordenado con páginas separadas | → Vitrina |
| Tener un sitio completo con blog y galería | Presencia corporativa completa | → Negocio |
| Vender productos online | Tienda con carro de compras y pagos | → Tienda |
| Tengo algo más específico en mente | Funcionalidades particulares de mi negocio | → A Medida |

*Si selecciona Landing Page, Vitrina, Negocio o Tienda → ir a Paso A2.*  
*Si selecciona A Medida → saltar directo a Resultado con mensaje especial.*

**Paso A2 — ¿Necesitas plan de mantención mensual?**
> El sitio vivirá en el VPS de ODIN Tech, por eso se ofrece mantención mensual para cubrir hosting y soporte.

| Opción |
|--------|
| Sí, quiero que se encarguen del hosting y soporte |
| Solo el desarrollo por ahora |

*Si elige Sí → mostrar los 3 planes de mantención para que elija uno → Resultado A.*  
*Si elige No → Resultado A sin mantención.*

---

### Rama B — Aplicaciones Personalizadas

**Paso B1 — ¿Qué quieres digitalizar?**

| Opción | Ejemplo visible | Señal de complejidad |
|--------|----------------|----------------------|
| Un proceso puntual | "Ej: gestión de pedidos o control de inventario" | → Básica |
| Varios procesos conectados entre sí | "Ej: pedidos + clientes + reportes" | → Media |
| Un sistema completo con múltiples usuarios | "Ej: plataforma con roles, reportes, lógica avanzada" | → Compleja |

→ Ir a Paso B2.

**Paso B2 — ¿Necesitas plan de operación continua?**
> La aplicación correrá en el VPS de ODIN Tech. El plan mensual cubre hosting, disponibilidad y soporte técnico.

| Opción |
|--------|
| Sí, quiero que se encarguen del hosting y operación |
| Solo el desarrollo por ahora |

*Si elige Sí → mostrar los 3 planes de Operación Continua para que elija uno → Resultado B.*  
*Si elige No → Resultado B sin plan mensual.*

---

### Rama C — Integración de Sistemas

**Paso C1 — ¿Cuántos sistemas necesitas conectar?**

| Opción | Ejemplo visible | Señal de complejidad |
|--------|----------------|----------------------|
| Dos herramientas con un flujo simple | "Ej: formulario web → planilla → notificación" | → Simple |
| Varios sistemas con automatización | "Ej: CRM + facturación + notificaciones sin duplicar datos" | → Media |

→ Ir a Paso C2.

**Paso C2 — ¿Necesitas plan de operación continua?**
> La integración correrá en el VPS de ODIN Tech. El plan mensual cubre hosting, disponibilidad y soporte técnico.

| Opción |
|--------|
| Sí, quiero que se encarguen del hosting y operación |
| Solo el desarrollo por ahora |

*Si elige Sí → mostrar los 3 planes de Operación Continua para que elija uno → Resultado C.*  
*Si elige No → Resultado C sin plan mensual.*

---

## 3. Lógica de Recomendación

### Tabla de mapeo Selecciones → Producto

| Rama | Selección clave | Producto recomendado | Precio a mostrar | Entrega |
|------|----------------|----------------------|-----------------|---------|
| A | Que me contacten | Landing Page | $99.000 | 3 días hábiles |
| A | Mostrar mis servicios | Vitrina | $249.000 | 5 días hábiles |
| A | Sitio completo con blog | Negocio | $449.000 | 10 días hábiles |
| A | Vender online | Tienda | $849.000 | 15 días hábiles |
| A | Algo específico | A Medida | Desde $1.200.000 | A coordinar |
| B | Un proceso puntual | App Básica | $800.000 – $1.500.000 | A coordinar |
| B | Varios procesos | App Media | $1.500.000 – $3.000.000 | A coordinar |
| B | Sistema completo | App Compleja | Desde $3.500.000 | A coordinar |
| C | Dos herramientas | Integración Simple | $350.000 – $590.000 | A coordinar |
| C | Varios sistemas | Integración Media | $590.000 – $1.290.000 | A coordinar |

### Lógica de mantención (aplica a todas las ramas, planes diferenciados)

Todos los productos viven en el VPS de ODIN Tech, por lo tanto se cobra un plan mensual por uso de recursos y disponibilidad del servidor. La pregunta de mantención aparece en las 3 ramas como paso adicional antes del resultado.

Los planes tienen el mismo precio en todas las ramas, pero el nombre y descripción cambian según el contexto:

#### Páginas Web — Plan de Mantención

| Plan | Incluye | Precio |
|------|---------|--------|
| **Básico** | Hosting + dominio + actualizaciones de seguridad | $49.000/mes |
| **Estándar** | Básico + soporte técnico + hasta 2 cambios de contenido/mes | $89.000/mes |
| **Plus** | Estándar + cambios ilimitados de contenido + atención prioritaria | $149.000/mes |

#### Apps e Integración — Plan de Operación Continua

| Plan | Incluye | Precio |
|------|---------|--------|
| **Básico** | Hosting en VPS + respaldo semanal de datos + actualizaciones de seguridad | $49.000/mes |
| **Estándar** | Básico + monitoreo de disponibilidad + soporte técnico ante caídas + 1 ajuste funcional/mes | $89.000/mes |
| **Plus** | Estándar + ajustes ilimitados + respaldo diario + atención prioritaria 24h | $149.000/mes |

El usuario elige uno de los tres y se suma al resumen final.

---

## 4. Pantalla de Resultado

Una vez completado el flujo, se muestra una tarjeta de resultado con:

```
┌─────────────────────────────────────────────┐
│  ✅ Tu solución ideal                        │
│                                             │
│  Producto:     Sitio Web Vitrina            │
│  Precio base:  $249.000 (IVA no incluido)   │
│  Entrega:      5 días hábiles               │
│                                             │
│  Incluye:                                   │
│  • Hasta 5 páginas                          │
│  • Formulario de contacto                   │
│  • Botón WhatsApp                           │
│  • Google Maps                              │
│  • Responsive                               │
│  • Soporte post-entrega 30 días             │
│                                             │
│  Mantención elegida: Plan Estándar          │
│  $89.000/mes                                │
│                                             │
│  [  Solicitar esta cotización  ]            │
│  [  Volver a empezar           ]            │
└─────────────────────────────────────────────┘
```

**Notas de UX:**
- El precio se muestra con formato CLP y nota "(IVA no incluido)".
- Para rangos de precio (Apps, Integración), mostrar el rango completo y aclarar: *"El precio exacto se define en la reunión de diagnóstico gratuita."*
- Para "A Medida" y "App Compleja": mostrar mensaje *"Este proyecto requiere una cotización personalizada. Te respondemos en menos de 24 horas."*
- Botón "Volver a empezar" reinicia el wizard al Paso 1 sin recargar la página.

---

## 5. Flujo de Envío — Formulario de Contacto

Al hacer click en "Solicitar esta cotización", se despliega (en la misma pantalla, debajo del resultado, sin cambiar de página) un formulario compacto:

### Campos del formulario

| Campo | Tipo | Requerido |
|-------|------|-----------|
| Nombre completo | text | ✅ |
| Teléfono (WhatsApp preferido) | tel | ✅ |
| Correo electrónico | email | ✅ |
| Nombre del negocio | text | ✅ |
| Mensaje adicional (opcional) | textarea | ❌ |

### Datos adjuntos automáticamente (no visibles para el usuario)
El formulario incluye como campos ocultos la cotización generada:
- Producto recomendado
- Precio mostrado
- Plan de mantención (si aplica)
- Todas las respuestas del wizard (Rama + selecciones)

### Destino del correo
- **Mecanismo:** `fetch POST` al webhook de n8n configurado en el VPS
- **Payload requerido por n8n:** `{ email, asunto, cuerpo }` (texto plano)
- **Destinatario:** `admin@odin-erp.cl`
- **Asunto generado automáticamente:** `Nueva cotización: [Producto recomendado] — [Nombre del negocio]`
- **URL del webhook:** constante `N8N_WEBHOOK_URL` en `cotizador.js` (Claude Code debe pedirle a Jaime la URL real antes de implementar)

### Implementación del envío

```javascript
// En cotizador.js
const N8N_WEBHOOK_URL = 'https://n8n.odin-erp.cl/webhook/XXXXXXXX'; // reemplazar con URL real

async function enviarCotizacion(datosContacto, resultado, selecciones) {
  const payload = {
    email:  'admin@odin-erp.cl',
    asunto: `Nueva cotización: ${resultado.producto} — ${datosContacto.negocio}`,
    cuerpo: construirCuerpo(datosContacto, resultado, selecciones)
  };

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Webhook error');
}
```

### Cuerpo del email (template)

```
Nueva solicitud de cotización desde el sitio web.

--- COTIZACIÓN GENERADA ---
Producto recomendado: Sitio Web Vitrina
Precio base: $249.000 (IVA no incluido)
Entrega estimada: 5 días hábiles
Plan de mantención: Estándar — $89.000/mes

--- SELECCIONES DEL USUARIO ---
Necesidad: Presencia en internet
Objetivo del sitio: Mostrar mis servicios con varias secciones
Mantención: Sí

--- DATOS DE CONTACTO ---
Nombre: [nombre]
Negocio: [negocio]
Teléfono: [teléfono]
Email: [email]
Mensaje: [mensaje]

---
Cotización generada el [fecha y hora] desde odin-tech.cl
```

### Estados del envío
- **Enviando:** botón deshabilitado + spinner
- **Éxito:** mensaje *"¡Listo! Te contactaremos en menos de 24 horas."* + ocultar formulario
- **Error:** mensaje *"Hubo un problema al enviar. Puedes escribirnos directamente a [email]"*

---

## 6. Requisitos Técnicos para Claude Code

### Stack
- HTML5 / CSS3 / JavaScript vanilla (ES6+)
- Sin frameworks ni bundlers
- Compatible con el sitio actual de ODIN Tech

### Archivos a crear / modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `cotizador.js` | Crear | Lógica completa del wizard, recomendación y envío vía n8n webhook |
| `style.css` | Modificar | Agregar estilos del cotizador respetando paleta y variables existentes |
| Página destino | Modificar | Claude Code decide qué página del sitio es la más apropiada para alojar el cotizador, tras revisar la estructura actual del sitio |

### Sin dependencias externas
El envío usa `fetch` nativo del navegador hacia el webhook de n8n. No se requiere ninguna librería adicional ni SDK de terceros.

### Paleta de colores (ya definida en el sitio)
```
--color-primary:    #6A1B9A   (Deep Orchid)
--color-secondary:  #C2185B   (Vibrant Fuchsia)
--color-accent:     #00E5FF   (Point Cyan)
--color-bg:         #1A1A2E   (Cosmic Depth)
--color-text-sec:   #212121   (Tech-Gray)
```
El cotizador debe usar estas variables — no hardcodear colores.

### Estructura JS sugerida (orientativa para Claude Code)

```javascript
// cotizador.js — estructura de módulos

const N8N_WEBHOOK_URL = 'https://n8n.odin-erp.cl/webhook/XXXXXXXX'; // reemplazar

const COTIZADOR = {
  state: {
    paso: 0,
    rama: null,          // 'web' | 'app' | 'integracion'
    selecciones: {},     // registro de cada respuesta
    resultado: null      // objeto con producto, precio, entrega, incluye[], mantencion
  },

  data: {
    productos: { /* tabla de mapeo completa */ },
    mantenciones: { /* planes Básico, Estándar, Plus */ }
  },

  render: {
    paso(n) { /* renderiza el paso n */ },
    resultado() { /* renderiza tarjeta de resultado */ },
    formulario() { /* despliega formulario de contacto */ }
  },

  logic: {
    recomendar() { /* evalúa state.selecciones → retorna producto */ },
    avanzar(seleccion) { /* actualiza state y llama render.paso() */ },
    reiniciar() { /* resetea state y renderiza paso 0 */ }
  },

  email: {
    construirCuerpo(datosContacto) { /* genera texto plano con state completo */ },
    enviar(datosContacto) {
      /* fetch POST a N8N_WEBHOOK_URL con { email, asunto, cuerpo } */
    }
  },

  init() { /* punto de entrada, renderiza paso 0 */ }
}
```

---

## 7. Criterios de Aceptación

El cotizador está correctamente implementado cuando:

- [ ] El usuario llega al resultado correcto en **máximo 3 clicks** desde el Paso 1 (4 si elige mantención)
- [ ] Todas las ramas (Web, App, Integración) están implementadas y funcionan
- [ ] La pregunta de mantención aparece en las 3 ramas
- [ ] El precio mostrado coincide exactamente con la tabla de precios del product-context
- [ ] El formulario de contacto valida campos requeridos antes de enviar
- [ ] El `fetch POST` al webhook de n8n envía correctamente `{ email, asunto, cuerpo }`
- [ ] El email llega a `admin@odin-erp.cl` con el formato definido
- [ ] El wizard funciona correctamente en móvil (responsive)
- [ ] El botón "Volver a empezar" resetea completamente sin recargar la página
- [ ] Los estilos respetan la paleta de colores de ODIN Tech
- [ ] No se usan frameworks ni librerías externas

---

## 8. Pendientes / Decisiones Abiertas

| Ítem | Estado | Nota |
|------|--------|------|
| URL del webhook n8n | ⏳ Pendiente | Jaime debe entregar la URL del webhook activo en `n8n.odin-erp.cl` |
| Ubicación en el sitio | ⏳ Delegar a Claude Code | Claude Code revisará la estructura actual del sitio y decidirá qué página es más apropiada; si no hay una clara, creará `/cotizar` |

---

*Documento listo para ser entregado a Claude Code como brief de implementación.*  
*Resolver los 2 pendientes de la sección 8 antes de iniciar la sesión de código.*
