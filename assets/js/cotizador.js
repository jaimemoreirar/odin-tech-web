/* ============================================================
   ODIN TECH — cotizador.js
   Wizard interactivo de cotización. Sin frameworks, sin deps.
   Webhook: n8n → sendMailUser → { correo_usuario, asunto, cuerpo }
   ============================================================ */

'use strict';

const N8N_WEBHOOK_URL = 'https://n8n.odin-erp.cl/webhook/sendMailUser';

const COTIZADOR = {

  state: {
    paso: 'inicio',
    rama: null,
    selecciones: {},
    resultado: null,
    planElegido: null,
    _tipoMantencion: null
  },

  data: {
    productos: {
      landing:     { nombre: 'Sitio Web Landing Page',    precio: '$99.000',               rango: false, especial: false, entrega: '3 días hábiles',
                     incluye: ['1 página scrollable con secciones de servicios y presentación', 'Formulario de contacto', 'Botón WhatsApp integrado', 'Diseño adaptado a tu marca', 'Responsive (celular y computador)', 'Soporte post-entrega 30 días'] },
      vitrina:     { nombre: 'Sitio Web Vitrina',          precio: '$249.000',              rango: false, especial: false, entrega: '5 días hábiles',
                     incluye: ['Hasta 5 páginas (Inicio, Servicios, Nosotros, Contacto + 1 extra)', 'Formulario de contacto', 'Botón WhatsApp', 'Google Maps', 'Diseño adaptado a tu marca', 'Responsive', 'Soporte post-entrega 30 días'] },
      negocio:     { nombre: 'Sitio Web Negocio',          precio: '$449.000',              rango: false, especial: false, entrega: '10 días hábiles',
                     incluye: ['Hasta 8 páginas', 'Blog integrado', 'Galería de imágenes', 'SEO básico', 'Redes sociales enlazadas', 'Diseño adaptado a tu marca', 'Responsive', 'Soporte post-entrega 30 días'] },
      tienda:      { nombre: 'Tienda Online',              precio: '$849.000',              rango: false, especial: false, entrega: '15 días hábiles',
                     incluye: ['Catálogo de productos', 'Carro de compras', 'Integración Flow / MercadoPago', 'Gestión de pedidos básica', 'Diseño adaptado a tu marca', 'Responsive', 'Soporte post-entrega 30 días'] },
      medida_web:  { nombre: 'Sitio Web a Medida',         precio: 'Desde $1.200.000',      rango: true,  especial: true,  entrega: 'A coordinar', incluye: [] },
      app_basica:  { nombre: 'Aplicación Básica',          precio: '$800.000 – $1.500.000', rango: true,  especial: false, entrega: 'A coordinar',
                     incluye: ['Un proceso digitalizado', 'Interfaz simple e intuitiva', 'Acceso web desde celular y computador', 'Soporte post-entrega 30 días'] },
      app_media:   { nombre: 'Aplicación Media',           precio: '$1.500.000 – $3.000.000',rango: true, especial: false, entrega: 'A coordinar',
                     incluye: ['Múltiples módulos conectados', 'Gestión de usuarios', 'Reportes básicos', 'Soporte post-entrega 30 días'] },
      app_compleja:{ nombre: 'Aplicación Compleja',        precio: 'Desde $3.500.000',      rango: true,  especial: true,  entrega: 'A coordinar', incluye: [] },
      int_simple:  { nombre: 'Integración Simple',         precio: '$350.000 – $590.000',   rango: true,  especial: false, entrega: 'A coordinar',
                     incluye: ['Conexión entre 2 herramientas', 'Flujo automatizado', 'Documentación del proceso', 'Soporte post-entrega 30 días'] },
      int_media:   { nombre: 'Integración Media',          precio: '$590.000 – $1.290.000', rango: true,  especial: false, entrega: 'A coordinar',
                     incluye: ['Múltiples sistemas conectados', 'Automatizaciones encadenadas', 'Monitoreo básico', 'Documentación', 'Soporte post-entrega 30 días'] },
    },

    plan: {
      nombre:  'Plan Hosting',
      precio:  '$29.000/mes',
      incluye: ['Hosting en nuestro servidor', 'Dominio incluido', 'Actualizaciones de seguridad', 'Soporte ante caídas']
    },

    labelSeleccion: {
      necesidad:  'Necesidad',
      objetivo:   'Objetivo del sitio',
      complejidad:'Complejidad',
      sistemas:   'Sistemas a conectar',
      mantencion: 'Hosting mensual'
    }
  },

  /* ── utilidades ── */
  container() { return document.getElementById('cotizador-app'); },

  render(html) {
    const c = this.container();
    if (!c) return;
    c.innerHTML = html;
    setTimeout(() => c.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  },

  progreso(paso, total) {
    return `<div class="ctz-progress" aria-hidden="true">${Array.from({ length: total }, (_, i) =>
      `<span class="ctz-progress__dot${i < paso ? ' active' : ''}"></span>`).join('')}</div>
      <p class="ctz-step__label">Paso ${paso} de ${total}</p>`;
  },

  /* ── PASO 0 — inicio ── */
  inicio() {
    Object.assign(this.state, { paso: 'inicio', rama: null, selecciones: {}, resultado: null, planElegido: null, _tipoMantencion: null });
    this.render(`
      <div class="ctz-step">
        ${this.progreso(1, 3)}
        <h2 class="ctz-step__title">¿Qué necesita tu negocio?</h2>
        <p class="ctz-step__subtitle">Elige la opción que mejor describe lo que buscas.</p>
        <div class="ctz-options ctz-options--3">
          <button class="ctz-option" onclick="COTIZADOR.elegirRama('web')">
            <span class="ctz-option__icon">🌐</span>
            <span class="ctz-option__title">Presencia en internet</span>
            <span class="ctz-option__desc">Quiero que mis clientes me encuentren online</span>
          </button>
          <button class="ctz-option" onclick="COTIZADOR.elegirRama('app')">
            <span class="ctz-option__icon">⚙️</span>
            <span class="ctz-option__title">Una aplicación para mi negocio</span>
            <span class="ctz-option__desc">Quiero digitalizar o automatizar procesos internos</span>
          </button>
          <button class="ctz-option" onclick="COTIZADOR.elegirRama('int')">
            <span class="ctz-option__icon">🔗</span>
            <span class="ctz-option__title">Conectar herramientas que ya uso</span>
            <span class="ctz-option__desc">Tengo sistemas que no se hablan entre sí</span>
          </button>
        </div>
      </div>
    `);
  },

  elegirRama(rama) {
    this.state.rama = rama;
    this.state.selecciones.necesidad = { web: 'Presencia en internet', app: 'Una aplicación para mi negocio', int: 'Conectar herramientas que ya uso' }[rama];
    if (rama === 'web') this.pasoA1();
    else if (rama === 'app') this.pasoB1();
    else this.pasoC1();
  },

  /* ── RAMA A — Páginas web ── */
  pasoA1() {
    this.state.paso = 'web_a1';
    this.render(`
      <div class="ctz-step">
        ${this.progreso(2, 3)}
        <h2 class="ctz-step__title">¿Cuál es el objetivo principal de tu sitio?</h2>
        <p class="ctz-step__subtitle">Selecciona la opción que más se acerca a lo que necesitas.</p>
        <div class="ctz-options ctz-options--2">
          <button class="ctz-option" onclick="COTIZADOR.elegirProductoWeb('landing')">
            <span class="ctz-option__title">Que me contacten / pidan información</span>
            <span class="ctz-option__desc">Una sola página, directo al grano</span>
          </button>
          <button class="ctz-option" onclick="COTIZADOR.elegirProductoWeb('vitrina')">
            <span class="ctz-option__title">Mostrar mis servicios con varias secciones</span>
            <span class="ctz-option__desc">Mini-sitio ordenado con páginas separadas</span>
          </button>
          <button class="ctz-option" onclick="COTIZADOR.elegirProductoWeb('negocio')">
            <span class="ctz-option__title">Sitio completo con blog y galería</span>
            <span class="ctz-option__desc">Presencia corporativa completa</span>
          </button>
          <button class="ctz-option" onclick="COTIZADOR.elegirProductoWeb('tienda')">
            <span class="ctz-option__title">Vender productos online</span>
            <span class="ctz-option__desc">Tienda con carro de compras y pagos</span>
          </button>
          <button class="ctz-option ctz-option--wide" onclick="COTIZADOR.elegirProductoWeb('medida_web')">
            <span class="ctz-option__title">Tengo algo más específico en mente</span>
            <span class="ctz-option__desc">Funcionalidades particulares de mi negocio</span>
          </button>
        </div>
        <button class="ctz-back" onclick="COTIZADOR.inicio()">← Volver</button>
      </div>
    `);
  },

  elegirProductoWeb(producto) {
    const labels = { landing: 'Que me contacten / pidan información', vitrina: 'Mostrar mis servicios con varias secciones', negocio: 'Sitio completo con blog y galería', tienda: 'Vender productos online', medida_web: 'Algo más específico' };
    this.state.selecciones.objetivo = labels[producto];
    this.state.resultado = this.data.productos[producto];
    producto === 'medida_web' ? this.mostrarResultado() : this.pasoMantencion('web');
  },

  /* ── RAMA B — Apps ── */
  pasoB1() {
    this.state.paso = 'app_b1';
    this.render(`
      <div class="ctz-step">
        ${this.progreso(2, 3)}
        <h2 class="ctz-step__title">¿Qué quieres digitalizar?</h2>
        <p class="ctz-step__subtitle">Cuéntanos qué tan complejo es lo que necesitas.</p>
        <div class="ctz-options ctz-options--3">
          <button class="ctz-option" onclick="COTIZADOR.elegirApp('app_basica')">
            <span class="ctz-option__title">Un proceso puntual</span>
            <span class="ctz-option__desc">Ej: gestión de pedidos o control de inventario</span>
          </button>
          <button class="ctz-option" onclick="COTIZADOR.elegirApp('app_media')">
            <span class="ctz-option__title">Varios procesos conectados entre sí</span>
            <span class="ctz-option__desc">Ej: pedidos + clientes + reportes</span>
          </button>
          <button class="ctz-option" onclick="COTIZADOR.elegirApp('app_compleja')">
            <span class="ctz-option__title">Un sistema completo con múltiples usuarios</span>
            <span class="ctz-option__desc">Ej: plataforma con roles, reportes y lógica avanzada</span>
          </button>
        </div>
        <button class="ctz-back" onclick="COTIZADOR.inicio()">← Volver</button>
      </div>
    `);
  },

  elegirApp(producto) {
    const labels = { app_basica: 'Un proceso puntual', app_media: 'Varios procesos conectados entre sí', app_compleja: 'Un sistema completo con múltiples usuarios' };
    this.state.selecciones.complejidad = labels[producto];
    this.state.resultado = this.data.productos[producto];
    producto === 'app_compleja' ? this.mostrarResultado() : this.pasoMantencion('app');
  },

  /* ── RAMA C — Integración ── */
  pasoC1() {
    this.state.paso = 'int_c1';
    this.render(`
      <div class="ctz-step">
        ${this.progreso(2, 3)}
        <h2 class="ctz-step__title">¿Cuántos sistemas necesitas conectar?</h2>
        <p class="ctz-step__subtitle">Cuéntanos el alcance de la integración.</p>
        <div class="ctz-options ctz-options--2">
          <button class="ctz-option" onclick="COTIZADOR.elegirIntegracion('int_simple')">
            <span class="ctz-option__title">Dos herramientas con un flujo simple</span>
            <span class="ctz-option__desc">Ej: formulario web → planilla → notificación</span>
          </button>
          <button class="ctz-option" onclick="COTIZADOR.elegirIntegracion('int_media')">
            <span class="ctz-option__title">Varios sistemas con automatización</span>
            <span class="ctz-option__desc">Ej: CRM + facturación + notificaciones sin duplicar datos</span>
          </button>
        </div>
        <button class="ctz-back" onclick="COTIZADOR.inicio()">← Volver</button>
      </div>
    `);
  },

  elegirIntegracion(producto) {
    const labels = { int_simple: 'Dos herramientas con un flujo simple', int_media: 'Varios sistemas con automatización' };
    this.state.selecciones.sistemas = labels[producto];
    this.state.resultado = this.data.productos[producto];
    this.pasoMantencion('app');
  },

  /* ── PASO HOSTING ── */
  pasoMantencion(tipo) {
    this.state.paso = 'mantencion';
    this.state._tipoMantencion = tipo;
    const p = this.data.plan;
    this.render(`
      <div class="ctz-step">
        ${this.progreso(3, 3)}
        <h2 class="ctz-step__title">¿Necesitas que alojemos tu proyecto?</h2>
        <p class="ctz-step__subtitle">Tu proyecto vivirá en nuestro servidor. El plan mensual cubre todo para que no tengas que preocuparte de nada técnico.</p>
        <div class="ctz-options ctz-options--2">
          <button class="ctz-option" onclick="COTIZADOR.elegirMantencion('si')">
            <span class="ctz-option__icon">🖥️</span>
            <span class="ctz-option__title">Sí — Plan Hosting · ${p.precio}</span>
            <span class="ctz-option__desc">${p.incluye.join(' · ')}</span>
          </button>
          <button class="ctz-option" onclick="COTIZADOR.elegirMantencion('no')">
            <span class="ctz-option__icon">🔧</span>
            <span class="ctz-option__title">Solo el desarrollo por ahora</span>
            <span class="ctz-option__desc">Me encargo yo del hosting. Sin cargo mensual adicional.</span>
          </button>
        </div>
        <button class="ctz-back" onclick="COTIZADOR.volverDeMantencion()">← Volver</button>
      </div>
    `);
  },

  volverDeMantencion() {
    const rama = this.state.rama;
    if (rama === 'web') this.pasoA1();
    else if (rama === 'app') this.pasoB1();
    else this.pasoC1();
  },

  elegirMantencion(opcion) {
    if (opcion === 'si') {
      this.state.planElegido = this.data.plan;
      this.state.selecciones.mantencion = `${this.data.plan.nombre} — ${this.data.plan.precio}`;
    } else {
      this.state.planElegido = null;
      this.state.selecciones.mantencion = 'Sin hosting mensual';
    }
    this.mostrarResultado();
  },

  /* ── RESULTADO ── */
  mostrarResultado() {
    const r    = this.state.resultado;
    const plan = this.state.planElegido;

    const incluyeHTML = r.incluye.length
      ? `<ul class="ctz-resultado__incluye">${r.incluye.map(i => `<li><span class="ctz-check">✓</span>${i}</li>`).join('')}</ul>`
      : '';

    const notaHTML = r.rango && !r.especial
      ? `<p class="ctz-resultado__nota">El precio exacto se define en la reunión de diagnóstico gratuita — sin costo ni compromiso.</p>`
      : '';

    const especalHTML = r.especial
      ? `<div class="ctz-resultado__especial">Este proyecto requiere una cotización personalizada. Te respondemos en menos de 24 horas.</div>`
      : '';

    const bloqueDesarrollo = `
      <div class="ctz-resultado__bloque">
        <div class="ctz-resultado__bloque-header">
          <span class="ctz-resultado__bloque-label">💻 Desarrollo del proyecto</span>
          <span class="ctz-resultado__bloque-tipo">Pago único</span>
        </div>
        <div class="ctz-resultado__bloque-body">
          <div class="ctz-resultado__fila">
            <span class="ctz-resultado__label">Producto</span>
            <span class="ctz-resultado__valor">${r.nombre}</span>
          </div>
          <div class="ctz-resultado__fila">
            <span class="ctz-resultado__label">Precio</span>
            <span class="ctz-resultado__valor ctz-resultado__precio">${r.precio} <small>(IVA no incluido)</small></span>
          </div>
          ${!r.especial ? `<div class="ctz-resultado__fila"><span class="ctz-resultado__label">Entrega</span><span class="ctz-resultado__valor">${r.entrega}</span></div>` : ''}
          ${notaHTML}
          ${especalHTML}
          ${incluyeHTML ? `<div class="ctz-resultado__fila-incluye">${incluyeHTML}</div>` : ''}
        </div>
      </div>`;

    const bloqueHosting = plan ? `
      <div class="ctz-resultado__bloque ctz-resultado__bloque--hosting">
        <div class="ctz-resultado__bloque-header">
          <span class="ctz-resultado__bloque-label">🖥️ Hosting mensual</span>
          <span class="ctz-resultado__bloque-tipo">Recurrente</span>
        </div>
        <div class="ctz-resultado__bloque-body">
          <div class="ctz-resultado__fila">
            <span class="ctz-resultado__label">Plan</span>
            <span class="ctz-resultado__valor">${plan.nombre}</span>
          </div>
          <div class="ctz-resultado__fila">
            <span class="ctz-resultado__label">Precio</span>
            <span class="ctz-resultado__valor ctz-resultado__precio-hosting">${plan.precio} <small>(IVA no incluido)</small></span>
          </div>
          <ul class="ctz-resultado__incluye" style="margin-top:var(--space-3);">${plan.incluye.map(i => `<li><span class="ctz-check">✓</span>${i}</li>`).join('')}</ul>
        </div>
      </div>` : '';

    this.render(`
      <div class="ctz-resultado reveal visible">
        <div class="ctz-resultado__header">
          <span class="ctz-resultado__badge">✅ Tu solución ideal</span>
        </div>
        <div class="ctz-resultado__bloques">
          ${bloqueDesarrollo}
          ${bloqueHosting}
        </div>
        <div class="ctz-resultado__actions">
          <button class="btn btn-primary" onclick="COTIZADOR.mostrarFormulario()">Solicitar esta cotización</button>
          <button class="ctz-back" onclick="COTIZADOR.inicio()">Volver a empezar</button>
        </div>
      </div>
      <div id="ctz-formulario-container"></div>
    `);
  },

  /* ── FORMULARIO DE CONTACTO ── */
  mostrarFormulario() {
    const container = document.getElementById('ctz-formulario-container');
    if (!container) return;
    container.innerHTML = `
      <div class="ctz-form">
        <h3 class="ctz-form__title">Cuéntanos sobre ti</h3>
        <p class="ctz-form__subtitle">Nos ponemos en contacto contigo en menos de 24 horas hábiles.</p>
        <form id="ctz-form" novalidate>
          <div class="ctz-form__row">
            <div class="ctz-form__group">
              <label for="ctz-nombre">Nombre completo *</label>
              <input type="text" id="ctz-nombre" placeholder="Tu nombre" required>
            </div>
            <div class="ctz-form__group">
              <label for="ctz-negocio">Nombre del negocio *</label>
              <input type="text" id="ctz-negocio" placeholder="¿Cómo se llama tu negocio?" required>
            </div>
          </div>
          <div class="ctz-form__row">
            <div class="ctz-form__group">
              <label for="ctz-telefono">Teléfono (WhatsApp preferido) *</label>
              <input type="tel" id="ctz-telefono" placeholder="+56 9 1234 5678" required>
            </div>
            <div class="ctz-form__group">
              <label for="ctz-email">Correo electrónico *</label>
              <input type="email" id="ctz-email" placeholder="tu@correo.cl" required>
            </div>
          </div>
          <div class="ctz-form__group">
            <label for="ctz-mensaje">Mensaje adicional (opcional)</label>
            <textarea id="ctz-mensaje" rows="3" placeholder="¿Algo más que quieras contarnos?"></textarea>
          </div>
          <div id="ctz-feedback" class="ctz-form__feedback" role="alert" aria-live="polite"></div>
          <button type="button" id="ctz-submit" class="btn btn-primary" style="width:100%;" onclick="COTIZADOR.enviar()">
            Enviar cotización
          </button>
        </form>
      </div>
    `;
    setTimeout(() => container.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  },

  async enviar() {
    const btn      = document.getElementById('ctz-submit');
    const feedback = document.getElementById('ctz-feedback');

    const nombre   = document.getElementById('ctz-nombre')?.value.trim()   || '';
    const negocio  = document.getElementById('ctz-negocio')?.value.trim()  || '';
    const telefono = document.getElementById('ctz-telefono')?.value.trim() || '';
    const email    = document.getElementById('ctz-email')?.value.trim()    || '';
    const mensaje  = document.getElementById('ctz-mensaje')?.value.trim()  || '';

    feedback.className = 'ctz-form__feedback';
    feedback.textContent = '';

    if (!nombre || !negocio || !telefono || !email) {
      feedback.textContent = 'Por favor completa todos los campos obligatorios.';
      feedback.className = 'ctz-form__feedback ctz-form__feedback--error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.textContent = 'Ingresa un correo electrónico válido.';
      feedback.className = 'ctz-form__feedback ctz-form__feedback--error';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const r    = this.state.resultado;
    const plan = this.state.planElegido;
    const sel  = this.state.selecciones;
    const fecha = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
    const asunto = `Nueva cotización: ${r.nombre} — ${negocio}`;

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo_usuario: 'admin@odin-erp.cl',
          asunto,
          cuerpo: this._construirEmail({ nombre, negocio, telefono, email, mensaje }, r, plan, sel, fecha)
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      document.getElementById('ctz-form').innerHTML = `
        <div class="ctz-form__success">
          <span style="font-size:2rem;">🎉</span>
          <p><strong>¡Listo!</strong> Te contactaremos en menos de 24 horas.</p>
        </div>`;

    } catch (err) {
      console.error('cotizador error:', err);
      feedback.innerHTML = `Hubo un problema al enviar. Escríbenos directamente a <a href="mailto:admin@odin-erp.cl">admin@odin-erp.cl</a>`;
      feedback.className = 'ctz-form__feedback ctz-form__feedback--error';
      btn.disabled = false;
      btn.textContent = 'Enviar cotización';
    }
  },

  /* ── EMAIL HTML ── */
  _construirEmail(c, r, plan, sel, fecha) {
    const planStr = plan ? `${plan.nombre} — ${plan.precio}` : 'Sin plan mensual';

    const selRows = Object.entries(sel).map(([k, v]) => {
      const label = this.data.labelSeleccion[k] || k;
      return `<tr style="border-bottom:1px solid rgba(106,27,154,0.2);">
        <td style="padding:9px 14px;color:#9E9E9E;font-size:13px;width:160px;">${label}</td>
        <td style="padding:9px 14px;color:#FFFFFF;font-size:14px;">${v}</td>
      </tr>`;
    }).join('');

    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,#6A1B9A 0%,#C2185B 60%,#E91E63 100%);border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
    <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#FFF;letter-spacing:1px;">ODIN TECH</p>
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;">Nueva solicitud de cotización</p>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#1A1A2E;padding:32px 40px;">
    <p style="margin:0 0 24px;font-size:12px;color:#9E9E9E;">Recibida el ${fecha} desde odin-erp.cl</p>

    <!-- Desarrollo -->
    <p style="margin:0 0 8px;font-size:11px;color:#00E5FF;text-transform:uppercase;letter-spacing:1.5px;">💻 Desarrollo del proyecto — Pago único</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#212121;border-radius:8px;margin-bottom:16px;">
      <tr style="border-bottom:1px solid rgba(106,27,154,0.2);"><td style="padding:10px 14px;color:#9E9E9E;font-size:13px;width:140px;">Producto</td><td style="padding:10px 14px;color:#FFF;font-size:15px;font-weight:600;">${r.nombre}</td></tr>
      <tr style="border-bottom:1px solid rgba(106,27,154,0.2);"><td style="padding:10px 14px;color:#9E9E9E;font-size:13px;">Precio</td><td style="padding:10px 14px;color:#E91E63;font-size:16px;font-weight:700;">${r.precio} <span style="font-size:11px;color:#9E9E9E;">(IVA no incluido)</span></td></tr>
      <tr><td style="padding:10px 14px;color:#9E9E9E;font-size:13px;">Entrega estimada</td><td style="padding:10px 14px;color:#FFF;font-size:14px;">${r.entrega}</td></tr>
    </table>

    <!-- Hosting -->
    <p style="margin:0 0 8px;font-size:11px;color:#00E5FF;text-transform:uppercase;letter-spacing:1.5px;">🖥️ Hosting mensual — Recurrente</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#212121;border-radius:8px;margin-bottom:24px;">
      <tr><td style="padding:10px 14px;color:#9E9E9E;font-size:13px;width:140px;">Plan</td><td style="padding:10px 14px;color:#FFF;font-size:14px;font-weight:600;">${planStr}</td></tr>
    </table>

    <!-- Selecciones -->
    <p style="margin:0 0 8px;font-size:11px;color:#00E5FF;text-transform:uppercase;letter-spacing:1.5px;">Selecciones del usuario</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#212121;border-radius:8px;margin-bottom:24px;">${selRows}</table>

    <!-- Contacto -->
    <p style="margin:0 0 8px;font-size:11px;color:#00E5FF;text-transform:uppercase;letter-spacing:1.5px;">Datos de contacto</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#212121;border-radius:8px;margin-bottom:28px;">
      <tr style="border-bottom:1px solid rgba(106,27,154,0.2);"><td style="padding:10px 14px;color:#9E9E9E;font-size:13px;width:140px;">Nombre</td><td style="padding:10px 14px;color:#FFF;font-size:14px;font-weight:600;">${c.nombre}</td></tr>
      <tr style="border-bottom:1px solid rgba(106,27,154,0.2);"><td style="padding:10px 14px;color:#9E9E9E;font-size:13px;">Negocio</td><td style="padding:10px 14px;color:#FFF;font-size:14px;">${c.negocio}</td></tr>
      <tr style="border-bottom:1px solid rgba(106,27,154,0.2);"><td style="padding:10px 14px;color:#9E9E9E;font-size:13px;">Teléfono</td><td style="padding:10px 14px;"><a href="https://wa.me/${c.telefono.replace(/\D/g,'')}" style="color:#00E5FF;text-decoration:none;">${c.telefono}</a></td></tr>
      <tr${c.mensaje ? ' style="border-bottom:1px solid rgba(106,27,154,0.2);"' : ''}><td style="padding:10px 14px;color:#9E9E9E;font-size:13px;">Correo</td><td style="padding:10px 14px;"><a href="mailto:${c.email}" style="color:#00E5FF;text-decoration:none;">${c.email}</a></td></tr>
      ${c.mensaje ? `<tr><td style="padding:10px 14px;color:#9E9E9E;font-size:13px;vertical-align:top;">Mensaje</td><td style="padding:10px 14px;color:#FFF;font-size:14px;">${c.mensaje}</td></tr>` : ''}
    </table>

    <a href="mailto:${c.email}" style="display:inline-block;background:linear-gradient(135deg,#6A1B9A,#C2185B);color:#FFF;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">Responder a ${c.nombre}</a>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#212121;border-radius:0 0 12px 12px;padding:16px 40px;text-align:center;border-top:1px solid rgba(106,27,154,0.35);">
    <p style="margin:0;font-size:12px;color:#9E9E9E;">Odin Tech · admin@odin-erp.cl · odin-erp.cl</p>
  </td></tr>

</table></td></tr></table>
</body></html>`;
  },

  init() {
    if (document.getElementById('cotizador-app')) this.inicio();
  }
};

document.addEventListener('DOMContentLoaded', () => COTIZADOR.init());
