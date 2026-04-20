#!/bin/bash
# Script para preparar frontend para Hostinger

set -e

echo "🚀 PREPARANDO FRONTEND PARA HOSTINGER"
echo "======================================"

cd "$(dirname "$0")"

# Directorio temporal para build final
BUILD_DIR="./hostinger-build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

echo "1. Copiando archivos del build existente..."
if [ -d "./dist/apps/web" ]; then
    cp -r ./dist/apps/web/* "$BUILD_DIR/"
    echo "   ✅ Copiado de dist/apps/web"
elif [ -d "./dist" ]; then
    # Buscar index.html en cualquier subdirectorio
    find ./dist -name "index.html" -exec dirname {} \; | head -1 | xargs -I {} cp -r {}/* "$BUILD_DIR/"
    echo "   ✅ Copiado de dist/"
else
    echo "   ❌ No se encontró build. Ejecuta primero: npm run build"
    exit 1
fi

echo "2. Verificando archivos esenciales..."
ESSENTIAL_FILES=("index.html" "assets/")
for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -e "$BUILD_DIR/$file" ]; then
        echo "   ✅ $file encontrado"
    else
        echo "   ⚠️  $file NO encontrado"
    fi
done

echo "3. Creando .htaccess optimizado..."
cat > "$BUILD_DIR/.htaccess" << 'HTACCESS'
# Configuración Apache para Hostinger - React SPA
RewriteEngine On

# Redirección HTTPS (recomendado)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Single Page Application
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$
RewriteRule ^ index.html [L]

# Cache estáticos (1 año)
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Compresión
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Seguridad
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Errores
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html
HTACCESS
echo "   ✅ .htaccess creado"

echo "4. Creando configuración para PocketBase..."
# Archivo de configuración para actualizar URL de API
cat > "$BUILD_DIR/config.js" << 'CONFIG'
// Configuración para producción
// Actualizar esta URL con la de tu PocketBase en Hostinger
window.APP_CONFIG = {
    API_URL: 'https://api.tudominio.com', // CAMBIAR ESTO
    ENV: 'production',
    VERSION: '1.0.0'
};
CONFIG
echo "   ✅ config.js creado"

echo "5. Inyectando configuración en index.html..."
if [ -f "$BUILD_DIR/index.html" ]; then
    # Añadir config.js antes del cierre de </head>
    sed -i '/<\/head>/i\    <script src="/config.js"></script>' "$BUILD_DIR/index.html"
    
    # Actualizar base href si es necesario
    sed -i 's|<base href="/hcgi/platform"|<base href="/"|g' "$BUILD_DIR/index.html" 2>/dev/null || true
    
    echo "   ✅ index.html actualizado"
else
    echo "   ❌ index.html no encontrado"
fi

echo "6. Comprimiendo archivos..."
if command -v gzip &> /dev/null; then
    find "$BUILD_DIR" -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -exec gzip -k -9 {} \;
    echo "   ✅ Archivos comprimidos (.gz)"
else
    echo "   ⚠️  gzip no disponible, saltando compresión"
fi

echo "7. Creando archivo README..."
cat > "$BUILD_DIR/README-HOSTINGER.md" << 'README'
# 🚀 FRONTEND PARA HOSTINGER

## 📋 INSTRUCCIONES DE INSTALACIÓN

### 1. Subir archivos a Hostinger
- Subir TODO el contenido de esta carpeta a `public_html/` en Hostinger
- Mantener la estructura de directorios

### 2. Configurar PocketBase
**IMPORTANTE:** Actualizar la URL de API en `config.js`:
```javascript
// Cambiar esta línea:
API_URL: 'https://api.tudominio.com'
// Por tu URL real de PocketBase
```

### 3. Verificar .htaccess
- Asegurarse que Apache tiene `mod_rewrite` habilitado
- Si hay problemas con rutas, revisar reglas de rewrite

### 4. Configurar dominio
- En panel de Hostinger, apuntar dominio a esta carpeta
- Configurar SSL/HTTPS si es posible

## 🔧 TROUBLESHOOTING

### Problema: Páginas no cargan (404)
**Solución:** Verificar que `.htaccess` está en `public_html/`

### Problema: API no conecta
**Solución:** Actualizar `config.js` con URL correcta

### Problema: CSS/JS no cargan
**Solución:** Verificar permisos (755 para directorios, 644 para archivos)

## 📞 SOPORTE
- Revisar logs de error en Hostinger
- Verificar consola del navegador (F12)
- Probar con URL directa: `https://tudominio.com/index.html`

README
echo "   ✅ README creado"

echo ""
echo "✅ PREPARACIÓN COMPLETADA"
echo "========================"
echo ""
echo "📁 Build listo en: $BUILD_DIR/"
echo "📊 Tamaño: $(du -sh "$BUILD_DIR" | cut -f1)"
echo ""
echo "🚀 PARA SUBIR A HOSTINGER:"
echo "1. Acceder a File Manager de Hostinger"
echo "2. Navegar a public_html/"
echo "3. Subir TODO el contenido de $BUILD_DIR/"
echo "4. Actualizar config.js con tu URL de PocketBase"
echo ""
echo "🔗 URL esperadas:"
echo "   - Frontend: https://tudominio.com/"
echo "   - API: https://api.tudominio.com (debe existir)"
echo ""
echo "🎯 ¡Listo para producción!"