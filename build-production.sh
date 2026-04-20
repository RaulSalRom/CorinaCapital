#!/bin/bash
# Script para build de producción optimizado
# Genera archivos listos para Hostinger

set -e

echo "🚀 Build de producción optimizado"
echo "================================="

cd "$(dirname "$0")"

# Verificar Node.js y npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm no encontrado"
    exit 1
fi

echo "📦 Node.js: $(node --version)"
echo "📦 npm: $(npm --version)"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependencias..."
    npm ci --silent
else
    echo "✅ Dependencias ya instaladas"
fi

# Crear build de producción
echo "🔨 Creando build de producción..."
npm run build

# Verificar build
if [ ! -d "dist" ]; then
    echo "❌ Build falló, no se creó directorio dist"
    exit 1
fi

# Optimizar archivos estáticos
echo "⚡ Optimizando archivos estáticos..."

# Comprimir HTML, CSS, JS
if command -v gzip &> /dev/null; then
    echo "📦 Comprimiendo archivos..."
    find dist -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -exec gzip -k -9 {} \;
    echo "✅ Archivos comprimidos (.gz)"
fi

# Crear archivo de version
echo "🏷️  Creando archivo de versión..."
VERSION=$(date +%Y%m%d.%H%M%S)
echo "version: $VERSION" > dist/version.txt
echo "build_date: $(date)" >> dist/version.txt
echo "node_version: $(node --version)" >> dist/version.txt

# Estadísticas del build
echo ""
echo "📊 Estadísticas del build:"
echo "=========================="
du -sh dist/
echo ""
find dist -type f | wc -l | xargs echo "Total archivos:"
find dist -name "*.js" | wc -l | xargs echo "Archivos JS:"
find dist -name "*.css" | wc -l | xargs echo "Archivos CSS:"
find dist -name "*.html" | wc -l | xargs echo "Archivos HTML:"

echo ""
echo "✅ Build completado exitosamente"
echo ""
echo "📁 Directorio de producción: dist/"
echo ""
echo "🚀 Para deploy en Hostinger:"
echo "1. Subir contenido de dist/ a public_html/"
echo "2. Configurar .htaccess para SPA"
echo "3. Configurar dominio en Hostinger"
echo ""
echo "🔧 Scripts adicionales disponibles:"
echo "   ./deploy-to-hostinger.sh  - Para deploy automático"
echo "   ./optimize-images.sh      - Para optimizar imágenes"