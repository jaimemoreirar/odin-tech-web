# Guía: Deploy pull-based con git + rsync

Patrón usado en KVASIR para desplegar a un VPS sin CI/CD: el servidor "jala"
los cambios con `git pull` cuando alguien se lo pide a mano, en vez de que
GitHub empuje el código (eso sería push-based, ej. GitHub Actions + SSH).

## Prerrequisitos

- Repo del proyecto (público o privado)
- Acceso SSH root (o sudo) al VPS
- `gh` CLI instalado localmente (opcional pero simplifica los pasos 1-2)

---

## 1. Crear repo privado en GitHub (si no existe)

```bash
cd /ruta/al/proyecto
gh repo create --private --source=. --push
```

## 2. Crear una deploy key SSH de solo lectura

En el VPS, genera una key dedicada (sin passphrase, para uso no interactivo):

```bash
ssh-keygen -t ed25519 -C "deploy-nombreproyecto" -f ~/.ssh/deploy_nombreproyecto -N ""
cat ~/.ssh/deploy_nombreproyecto.pub
```

Copia esa clave pública y agrégala al repo (desde tu máquina local, con `gh`):

```bash
gh repo deploy-key add /ruta/a/deploy_nombreproyecto.pub --repo usuario/nombreproyecto --title "vps-deploy"
```

## 3. Configurar el alias SSH en el VPS

Edita `~/.ssh/config` en el VPS:

```
Host github-nombreproyecto
    HostName github.com
    User git
    IdentityFile ~/.ssh/deploy_nombreproyecto
    IdentitiesOnly yes
```

## 4. Clonar el repo en una ruta neutral del VPS

Esta carpeta es la única que se actualiza con `git pull` — nunca se sirve
directo ni se edita a mano.

```bash
mkdir -p /opt/nombreproyecto
git clone github-nombreproyecto:usuario/nombreproyecto.git /opt/nombreproyecto
```

(usa el alias del paso 3 en vez de la URL normal de GitHub, así usa la deploy key)

## 5. Confirmar el `.gitignore` de secretos

Antes de cualquier deploy, asegúrate de que el repo **nunca** trackee
archivos de secrets reales:

```
.env
.env.*
!.env.example
.Renviron
.Renviron.example
```

(ajusta según el runtime — Node usa `.env`, R usa `.Renviron`, etc.) Los
secrets de producción van aparte, en `/etc/<app>/*.env`, inyectados por
systemd (`EnvironmentFile=`), nunca dentro del repo.

## 6. El comando de deploy (repetible, uno por servicio/sitio)

**Para un sitio estático** (frontend servido directo por Apache/Nginx):

```bash
cd /opt/nombreproyecto
git pull
rsync -av --delete carpeta-del-frontend/ /ruta/real/del/sitio/public_html/
chown -R usuario-del-sitio:usuario-del-sitio /ruta/real/del/sitio/public_html/
```

**Para un servicio backend** (systemd):

```bash
cd /opt/nombreproyecto
git pull
rsync -av --delete --exclude='.env' --exclude='.env.example' carpeta-del-backend/ /ruta/real/del/servicio/
chown -R usuario-del-servicio:usuario-del-servicio /ruta/real/del/servicio/
systemctl restart nombre-del-servicio
```

Los `--exclude` son obligatorios si en algún momento el repo local (dev)
llegó a tener un `.env`/`.Renviron` real — sin ellos, el rsync sobreescribe
los secrets de producción con los de desarrollo.

## 7. (Opcional) Envolver esto en un script

Una vez que el flujo esté probado a mano, conviene guardarlo como
`deploy.sh` en el repo mismo (no como algo que se pega cada vez):

```bash
#!/bin/bash
set -e
cd /opt/nombreproyecto
git pull
rsync -av --delete --exclude='.env' --exclude='.env.example' backend/ /ruta/real/servicio/
chown -R app:app /ruta/real/servicio/
rsync -av --delete frontend/ /ruta/real/sitio/public_html/
chown -R sitio:sitio /ruta/real/sitio/public_html/
systemctl restart mi-servicio
echo "Deploy listo."
```

---

## Por qué funciona

- **Fuente de verdad única**: el clon en `/opt/...` solo cambia por
  `git pull` — nunca se toca a mano.
- **`rsync --delete`** es lo que elimina archivos viejos automáticamente:
  si algo se borró en el repo, se borra también en el destino real.
- **Separación estricta código/secrets**: el código vive en git, los
  secrets viven solo en `/etc/<app>/*.env` en el servidor — así el repo
  puede compartirse o respaldarse sin exponer nada sensible.
- **`chown` después de cada rsync** porque todo corre como root por SSH y
  deja los archivos con dueño incorrecto si no se corrige.
