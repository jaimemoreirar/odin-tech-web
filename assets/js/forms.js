/* ============================================================
   ODIN TECH — forms.js
   Validación client-side, envío via fetch, estados loading /
   éxito / error — formulario de contacto y newsletter
   ============================================================ */

'use strict';

/* === UTILIDADES === */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(inputId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`${inputId}-error`);
  if (input)  input.classList.add('error');
  if (error)  error.textContent = message;
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`${inputId}-error`);
  if (input)  input.classList.remove('error');
  if (error)  error.textContent = '';
}

function showFeedback(feedbackId, message, type = 'success') {
  const el = document.getElementById(feedbackId);
  if (!el) return;
  el.textContent = message;
  el.className = `form-feedback form-feedback--${type} show`;
  if (type === 'success') {
    setTimeout(() => {
      el.classList.remove('show');
    }, 6000);
  }
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.classList.add('btn--loading');
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = 'Enviando...';
  } else {
    btn.classList.remove('btn--loading');
    btn.disabled = false;
    if (btn.dataset.originalText) {
      btn.innerHTML = btn.dataset.originalText;
      // Re-crear los iconos de Lucide dentro del botón
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });
    }
  }
}

/* === VALIDACIÓN — formulario de contacto === */

function validateContactForm() {
  let valid = true;

  const nombre   = document.getElementById('nombre');
  const email    = document.getElementById('email');
  const asunto   = document.getElementById('asunto');
  const mensaje  = document.getElementById('mensaje');
  const privacidad = document.getElementById('privacidad');

  // Limpiar errores previos
  ['nombre', 'email', 'asunto', 'mensaje', 'privacidad'].forEach(clearError);

  if (!nombre || !nombre.value.trim()) {
    setError('nombre', 'El nombre es obligatorio.');
    valid = false;
  } else if (nombre.value.trim().length < 2) {
    setError('nombre', 'El nombre debe tener al menos 2 caracteres.');
    valid = false;
  }

  if (!email || !email.value.trim()) {
    setError('email', 'El correo electrónico es obligatorio.');
    valid = false;
  } else if (!EMAIL_RE.test(email.value.trim())) {
    setError('email', 'Ingresa un correo electrónico válido.');
    valid = false;
  }

  if (!asunto || !asunto.value) {
    setError('asunto', 'Selecciona un asunto.');
    valid = false;
  }

  if (!mensaje || !mensaje.value.trim()) {
    setError('mensaje', 'El mensaje es obligatorio.');
    valid = false;
  } else if (mensaje.value.trim().length < 20) {
    setError('mensaje', 'El mensaje debe tener al menos 20 caracteres.');
    valid = false;
  }

  if (privacidad && !privacidad.checked) {
    setError('privacidad', 'Debes aceptar la política de privacidad.');
    valid = false;
  }

  return valid;
}

/* === ENVÍO — formulario de contacto === */

function initContactForm() {
  const form   = document.getElementById('contact-form');
  const btn    = document.getElementById('submit-btn');
  if (!form) return;

  // Limpiar error en tiempo real al escribir
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      if (field.id) clearError(field.id);
      field.classList.remove('error');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateContactForm()) {
      // Hacer foco al primer campo con error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    setButtonLoading(btn, true);

    const payload = {
      nombre:    document.getElementById('nombre')?.value.trim(),
      email:     document.getElementById('email')?.value.trim(),
      telefono:  document.getElementById('telefono')?.value.trim() || null,
      asunto:    document.getElementById('asunto')?.value,
      mensaje:   document.getElementById('mensaje')?.value.trim(),
    };

    try {
      const API_URL = 'https://n8n.odin-erp.cl/webhook/sendMailUser';

      const nombre   = payload.nombre;
      const telefono = payload.telefono ? `<tr><td style="padding:8px 0;color:#9E9E9E;font-size:14px;">Teléfono</td><td style="padding:8px 0;color:#FFFFFF;font-size:14px;">${payload.telefono}</td></tr>` : '';

      const cuerpo = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#6A1B9A 0%,#C2185B 60%,#E91E63 100%);border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:1px;">ODIN TECH</p>
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;">Tecnología que piensa contigo</p>
        </td></tr>

        <!-- BADGE -->
        <tr><td style="background:#1A1A2E;padding:0 40px;">
          <div style="margin-top:-1px;padding:10px 0;border-bottom:1px solid rgba(106,27,154,0.35);">
            <span style="display:inline-block;background:rgba(0,229,255,0.12);border:1px solid rgba(0,229,255,0.3);color:#00E5FF;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:4px 14px;border-radius:20px;">Nuevo mensaje de contacto</span>
          </div>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#1A1A2E;padding:32px 40px;">
          <p style="margin:0 0 24px;font-size:15px;color:#9E9E9E;line-height:1.6;">Se recibió un mensaje desde el formulario de contacto del sitio web.</p>

          <!-- DATOS -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px;">
            <tr style="border-bottom:1px solid rgba(106,27,154,0.25);">
              <td style="padding:10px 0;color:#9E9E9E;font-size:13px;width:120px;text-transform:uppercase;letter-spacing:0.5px;">Nombre</td>
              <td style="padding:10px 0;color:#FFFFFF;font-size:15px;font-weight:600;">${nombre}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(106,27,154,0.25);">
              <td style="padding:10px 0;color:#9E9E9E;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Correo</td>
              <td style="padding:10px 0;"><a href="mailto:${payload.email}" style="color:#00E5FF;font-size:15px;text-decoration:none;">${payload.email}</a></td>
            </tr>
            ${telefono ? `<tr style="border-bottom:1px solid rgba(106,27,154,0.25);"><td style="padding:10px 0;color:#9E9E9E;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Teléfono</td><td style="padding:10px 0;color:#FFFFFF;font-size:15px;">${payload.telefono}</td></tr>` : ''}
            <tr>
              <td style="padding:10px 0;color:#9E9E9E;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Asunto</td>
              <td style="padding:10px 0;"><span style="display:inline-block;background:rgba(194,24,91,0.15);border:1px solid rgba(194,24,91,0.35);color:#E91E63;font-size:13px;font-weight:600;padding:3px 12px;border-radius:20px;">${payload.asunto}</span></td>
            </tr>
          </table>

          <!-- MENSAJE -->
          <p style="margin:0 0 10px;font-size:12px;color:#9E9E9E;text-transform:uppercase;letter-spacing:1px;">Mensaje</p>
          <div style="background:#212121;border-left:3px solid #C2185B;border-radius:0 8px 8px 0;padding:20px 24px;">
            <p style="margin:0;font-size:15px;color:#FFFFFF;line-height:1.75;white-space:pre-wrap;">${payload.mensaje}</p>
          </div>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#1A1A2E;padding:0 40px 32px;text-align:center;">
          <a href="mailto:${payload.email}" style="display:inline-block;margin-top:8px;background:linear-gradient(135deg,#6A1B9A,#C2185B);color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;padding:12px 32px;border-radius:8px;">Responder a ${nombre}</a>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#212121;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;border-top:1px solid rgba(106,27,154,0.35);">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#FFFFFF;">Odin Tech</p>
          <p style="margin:0;font-size:12px;color:#9E9E9E;">admin@odin-erp.cl · odin-erp.cl</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          correo_usuario: payload.email,
          asunto:         payload.asunto,
          cuerpo,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showFeedback(
        'contact-feedback',
        '¡Mensaje enviado! Te responderemos en menos de 24 horas.',
        'success'
      );
      form.reset();

    } catch (err) {
      console.error('Error enviando formulario:', err);
      showFeedback(
        'contact-feedback',
        'Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo o escríbenos a admin@odin-erp.cl.',
        'error'
      );
    } finally {
      setButtonLoading(btn, false);
    }
  });
}

/* === VALIDACIÓN — newsletter === */

function validateNewsletterForm(emailInput) {
  if (!emailInput || !emailInput.value.trim()) {
    emailInput?.classList.add('error');
    return false;
  }
  if (!EMAIL_RE.test(emailInput.value.trim())) {
    emailInput?.classList.add('error');
    return false;
  }
  emailInput.classList.remove('error');
  return true;
}

/* === ENVÍO — newsletter === */

function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  const emailInput = document.getElementById('newsletter-email');
  const btn        = form.querySelector('button[type="submit"]');

  if (emailInput) {
    emailInput.addEventListener('input', () => emailInput.classList.remove('error'));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateNewsletterForm(emailInput)) {
      emailInput?.focus();
      return;
    }

    setButtonLoading(btn, true);

    try {
      const API_URL = 'https://api.odin-erp.cl/newsletter';
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: emailInput.value.trim() }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showFeedback('newsletter-feedback', '¡Suscripción exitosa! Bienvenido/a.', 'success');
      form.reset();

    } catch (err) {
      console.error('Error newsletter:', err);
      showFeedback(
        'newsletter-feedback',
        'No se pudo completar la suscripción. Intenta de nuevo.',
        'error'
      );
    } finally {
      setButtonLoading(btn, false);
    }
  });
}

/* === VALIDACIÓN — formulario demo === */

function validateDemoForm() {
  let valid = true;

  const rutEmpresa      = document.getElementById('demo-rut-empresa');
  const nombreEmpresa   = document.getElementById('demo-nombre-empresa');
  const giro            = document.getElementById('demo-giro');
  const direccion       = document.getElementById('demo-direccion');
  const comuna          = document.getElementById('demo-comuna');
  const ciudad          = document.getElementById('demo-ciudad');
  const telefonoEmpresa = document.getElementById('demo-telefono-empresa');
  const rutAdmin        = document.getElementById('demo-rut-admin');
  const nombreAdmin     = document.getElementById('demo-nombre-admin');
  const email           = document.getElementById('demo-email');
  const privacidad      = document.getElementById('demo-privacidad');

  const fields = ['demo-rut-empresa','demo-nombre-empresa','demo-giro','demo-direccion','demo-comuna','demo-ciudad','demo-telefono-empresa','demo-rut-admin','demo-nombre-admin','demo-email','demo-privacidad'];
  fields.forEach(clearError);

  if (!rutEmpresa || !rutEmpresa.value.trim()) { setError('demo-rut-empresa', 'El RUT de la empresa es obligatorio.'); valid = false; }
  else if (!/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(rutEmpresa.value.trim())) { setError('demo-rut-empresa', 'Formato inválido: 12.345.678-9'); valid = false; }

  if (!nombreEmpresa || !nombreEmpresa.value.trim()) { setError('demo-nombre-empresa', 'El nombre del negocio es obligatorio.'); valid = false; }

  if (!giro || !giro.value.trim()) { setError('demo-giro', 'El giro es obligatorio.'); valid = false; }

  if (!direccion || !direccion.value.trim()) { setError('demo-direccion', 'La dirección es obligatoria.'); valid = false; }

  if (!comuna || !comuna.value.trim()) { setError('demo-comuna', 'La comuna es obligatoria.'); valid = false; }

  if (!ciudad || !ciudad.value.trim()) { setError('demo-ciudad', 'La ciudad es obligatoria.'); valid = false; }

  if (!telefonoEmpresa || !telefonoEmpresa.value.trim()) { setError('demo-telefono-empresa', 'El teléfono es obligatorio.'); valid = false; }

  if (!rutAdmin || !rutAdmin.value.trim()) { setError('demo-rut-admin', 'Tu RUT personal es obligatorio.'); valid = false; }
  else if (!/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(rutAdmin.value.trim())) { setError('demo-rut-admin', 'Formato inválido: 12.345.678-9'); valid = false; }

  if (!nombreAdmin || !nombreAdmin.value.trim()) { setError('demo-nombre-admin', 'Tu nombre es obligatorio.'); valid = false; }

  if (!email || !email.value.trim()) { setError('demo-email', 'El correo electrónico es obligatorio.'); valid = false; }
  else if (!EMAIL_RE.test(email.value.trim())) { setError('demo-email', 'Ingresa un correo electrónico válido.'); valid = false; }

  if (privacidad && !privacidad.checked) { setError('demo-privacidad', 'Debes aceptar la política de privacidad.'); valid = false; }

  return valid;
}

/* === ENVÍO — formulario demo === */

function initDemoForm() {
  const form = document.getElementById('demo-form');
  const btn  = document.getElementById('demo-submit-btn');
  if (!form) return;

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      if (field.id) clearError(field.id);
      field.classList.remove('error');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateDemoForm()) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    setButtonLoading(btn, true);

    const payload = {
      rut_empresa:      document.getElementById('demo-rut-empresa')?.value.trim(),
      nombre_empresa:   document.getElementById('demo-nombre-empresa')?.value.trim(),
      giro:             document.getElementById('demo-giro')?.value.trim(),
      direccion:        document.getElementById('demo-direccion')?.value.trim(),
      comuna:           document.getElementById('demo-comuna')?.value.trim(),
      ciudad:           document.getElementById('demo-ciudad')?.value.trim(),
      telefono_empresa: document.getElementById('demo-telefono-empresa')?.value.trim(),
      rut_admin:        document.getElementById('demo-rut-admin')?.value.trim(),
      nombre_admin:     document.getElementById('demo-nombre-admin')?.value.trim(),
      email:            document.getElementById('demo-email')?.value.trim(),
    };

    try {
      const API_URL = 'https://n8n.odin-erp.cl/webhook/registro-demo';

      const nombreAdmin = payload.nombre_admin;
      const nombreEmpresa = payload.nombre_empresa;

      const cuerpo = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#6A1B9A 0%,#C2185B 60%,#E91E63 100%);border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:1px;">ODIN TECH</p>
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;">Tecnología que piensa contigo</p>
        </td></tr>

        <!-- BADGE -->
        <tr><td style="background:#1A1A2E;padding:0 40px;">
          <div style="margin-top:-1px;padding:10px 0;border-bottom:1px solid rgba(106,27,154,0.35);">
            <span style="display:inline-block;background:rgba(0,229,255,0.12);border:1px solid rgba(0,229,255,0.3);color:#00E5FF;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:4px 14px;border-radius:20px;">Nuevo registro — Trial 14 días</span>
          </div>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#1A1A2E;padding:32px 40px;">
          <p style="margin:0 0 24px;font-size:15px;color:#9E9E9E;line-height:1.6;">Se ha registrado un nuevo cliente solicitando trial de Odin ERP.</p>

          <!-- DATOS NEGOCIO -->
          <p style="margin:0 0 10px;font-size:12px;color:#9E9E9E;text-transform:uppercase;letter-spacing:1px;">Datos del negocio</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
            <tr style="border-bottom:1px solid rgba(106,27,154,0.25);">
              <td style="padding:8px 0;color:#9E9E9E;font-size:12px;width:110px;text-transform:uppercase;">Empresa</td>
              <td style="padding:8px 0;color:#FFFFFF;font-size:14px;font-weight:600;">${nombreEmpresa}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(106,27,154,0.25);">
              <td style="padding:8px 0;color:#9E9E9E;font-size:12px;text-transform:uppercase;">RUT</td>
              <td style="padding:8px 0;color:#FFFFFF;font-size:14px;">${payload.rut_empresa}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(106,27,154,0.25);">
              <td style="padding:8px 0;color:#9E9E9E;font-size:12px;text-transform:uppercase;">Giro</td>
              <td style="padding:8px 0;color:#FFFFFF;font-size:14px;">${payload.giro}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(106,27,154,0.25);">
              <td style="padding:8px 0;color:#9E9E9E;font-size:12px;text-transform:uppercase;">Dirección</td>
              <td style="padding:8px 0;color:#FFFFFF;font-size:14px;">${payload.direccion}, ${payload.comuna}, ${payload.ciudad}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9E9E9E;font-size:12px;text-transform:uppercase;">Teléfono</td>
              <td style="padding:8px 0;color:#FFFFFF;font-size:14px;">${payload.telefono_empresa}</td>
            </tr>
          </table>

          <!-- DATOS ADMIN -->
          <p style="margin:0 0 10px;font-size:12px;color:#9E9E9E;text-transform:uppercase;letter-spacing:1px;">Cuenta de administrador</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
            <tr style="border-bottom:1px solid rgba(106,27,154,0.25);">
              <td style="padding:8px 0;color:#9E9E9E;font-size:12px;width:110px;text-transform:uppercase;">Nombre</td>
              <td style="padding:8px 0;color:#FFFFFF;font-size:14px;font-weight:600;">${nombreAdmin}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(106,27,154,0.25);">
              <td style="padding:8px 0;color:#9E9E9E;font-size:12px;text-transform:uppercase;">RUT</td>
              <td style="padding:8px 0;color:#FFFFFF;font-size:14px;">${payload.rut_admin}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9E9E9E;font-size:12px;text-transform:uppercase;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${payload.email}" style="color:#00E5FF;font-size:14px;text-decoration:none;">${payload.email}</a></td>
            </tr>
          </table>

          <p style="margin:0;font-size:13px;color:#9E9E9E;font-style:italic;">Plan: Pro · Trial: 14 días · Onboarding: demo</p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#212121;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;border-top:1px solid rgba(106,27,154,0.35);">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#FFFFFF;">Odin Tech</p>
          <p style="margin:0;font-size:12px;color:#9E9E9E;">admin@odin-erp.cl · odin-erp.cl</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          correo_usuario: payload.email,
          asunto:         `Nuevo registro: ${nombreEmpresa} — Trial 14 días`,
          cuerpo,
          tipo:           'registro_demo',
          datos:          payload,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showFeedback(
        'demo-feedback',
        '¡Cuenta creada! Revisa tu correo para obtener tus credenciales de acceso.',
        'success'
      );
      form.reset();

    } catch (err) {
      console.error('Error enviando registro:', err);
      showFeedback(
        'demo-feedback',
        'Hubo un problema al crear tu cuenta. Por favor intenta de nuevo o escríbenos a admin@odin-erp.cl.',
        'error'
      );
    } finally {
      setButtonLoading(btn, false);
    }
  });
}

/* === INICIALIZACIÓN === */
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initNewsletterForm();
  initDemoForm();
});
