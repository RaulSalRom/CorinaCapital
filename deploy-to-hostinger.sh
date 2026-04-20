#!/bin/bash
# Script para deploy automático en Hostinger
# Requiere: SSH acceso al VPS y configuración previa

set -e

echo "🚀 DEPLOY AUTOMÁTICO HOSTINGER"
echo "================================"

# Configuración (modificar según tu setup)
VPS_USER="tu_usuario"
VPS_HOST="ip-del-vps"
VPS_PORT="22"
SSH_KEY="~/.ssh/id_rsa"

FRONTEND_LOCAL="./dist"
FRONTEND_REMOTE="/home/$VPS_USER/public_html"

BACKEND_LOCAL="../database"
BACKEND_REMOTE="/home/$VPS_USER/corina-capital"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "Debes ejecutar desde el directorio testingWeb/"
    exit 1
fi

# Paso 1: Build de producción
echo ""
print_status "Paso 1: Creando build de producción..."
if [ ! -f "./build-production.sh" ]; then
    print_error "No se encontró build-production.sh"
    exit 1
fi

./build-production.sh

if [ ! -d "$FRONTEND_LOCAL" ]; then
    print_error "Build falló, no se creó $FRONTEND_LOCAL"
    exit 1
fi

print_status "Build completado: $(du -sh $FRONTEND_LOCAL | cut -f1)"

# Paso 2: Subir frontend al VPS
echo ""
print_status "Paso 2: Subiendo frontend al VPS..."
read -p "¿Subir frontend a $VPS_HOST? (s/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    print_status "Subiendo archivos..."
    
    # Crear backup del frontend actual en el VPS
    ssh -p $VPS_PORT -i $SSH_KEY $VPS_USER@$VPS_HOST \
        "mkdir -p $FRONTEND_REMOTE.backup && \
         cp -r $FRONTEND_REMOTE/* $FRONTEND_REMOTE.backup/ 2>/dev/null || true"
    
    # Subir nuevos archivos
    rsync -avz -e "ssh -p $VPS_PORT -i $SSH_KEY" \
        --exclude='*.map' \
        --exclude='*.gz' \
        $FRONTEND_LOCAL/ \
        $VPS_USER@$VPS_HOST:$FRONTEND_REMOTE/
    
    # Subir .htaccess
    if [ -f ".htaccess" ]; then
        scp -P $VPS_PORT -i $SSH_KEY .htaccess $VPS_USER@$VPS_HOST:$FRONTEND_REMOTE/
    fi
    
    # Configurar permisos
    ssh -p $VPS_PORT -i $SSH_KEY $VPS_USER@$VPS_HOST \
        "chmod -R 755 $FRONTEND_REMOTE && \
         chown -R $VPS_USER:$VPS_USER $FRONTEND_REMOTE"
    
    print_status "Frontend subido exitosamente"
else
    print_warning "Saltando subida de frontend"
fi

# Paso 3: Subir backend al VPS
echo ""
print_status "Paso 3: Subiendo backend al VPS..."
read -p "¿Subir backend a $VPS_HOST? (s/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    if [ ! -d "$BACKEND_LOCAL" ]; then
        print_error "No se encontró directorio backend: $BACKEND_LOCAL"
        exit 1
    fi
    
    print_status "Subiendo backend..."
    
    # Crear directorio remoto
    ssh -p $VPS_PORT -i $SSH_KEY $VPS_USER@$VPS_HOST \
        "mkdir -p $BACKEND_REMOTE"
    
    # Subir archivos backend (excluyendo node_modules y datos grandes)
    rsync -avz -e "ssh -p $VPS_PORT -i $SSH_KEY" \
        --exclude='node_modules' \
        --exclude='pb_data/data.db' \
        --exclude='pb_data/auxiliary.db' \
        --exclude='*.log' \
        --exclude='.git' \
        $BACKEND_LOCAL/ \
        $VPS_USER@$VPS_HOST:$BACKEND_REMOTE/
    
    # Configurar permisos
    ssh -p $VPS_PORT -i $SSH_KEY $VPS_USER@$VPS_HOST \
        "chmod +x $BACKEND_REMOTE/*.sh && \
         chmod 600 $BACKEND_REMOTE/.env 2>/dev/null || true"
    
    print_status "Backend subido exitosamente"
else
    print_warning "Saltando subida de backend"
fi

# Paso 4: Ejecutar comandos en el VPS
echo ""
print_status "Paso 4: Ejecutando comandos en el VPS..."
read -p "¿Ejecutar comandos de deploy en $VPS_HOST? (s/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    print_status "Ejecutando en VPS..."
    
    # Comandos a ejecutar en el VPS
    ssh -p $VPS_PORT -i $SSH_KEY $VPS_USER@$VPS_HOST << 'EOF'
        echo "=== INICIANDO DEPLOY EN VPS ==="
        
        # 1. Verificar servicios
        echo "1. Verificando servicios..."
        docker ps 2>/dev/null || echo "Docker no está corriendo"
        
        # 2. Actualizar backend si existe
        if [ -d "/home/$USER/corina-capital" ]; then
            echo "2. Actualizando backend..."
            cd /home/$USER/corina-capital
            
            # Detener servicios si están corriendo
            docker-compose down 2>/dev/null || true
            
            # Iniciar servicios
            docker-compose up -d
            
            echo "   ✅ Backend iniciado"
        fi
        
        # 3. Verificar frontend
        if [ -d "/home/$USER/public_html" ]; then
            echo "3. Verificando frontend..."
            ls -la /home/$USER/public_html/ | head -5
            echo "   ✅ Frontend listo"
        fi
        
        # 4. Verificar conexiones
        echo "4. Verificando conexiones..."
        
        # PostgreSQL
        if command -v pg_isready &> /dev/null; then
            pg_isready -h localhost -p 5432 && echo "   ✅ PostgreSQL OK" || echo "   ❌ PostgreSQL no responde"
        fi
        
        # PocketBase
        curl -s http://localhost:8090/api/health 2>/dev/null | grep -q "ok" && echo "   ✅ PocketBase OK" || echo "   ❌ PocketBase no responde"
        
        echo "=== DEPLOY COMPLETADO ==="
EOF
    
    print_status "Comandos ejecutados en VPS"
fi

# Paso 5: Verificación final
echo ""
print_status "Paso 5: Verificación final..."
echo ""
echo "📋 RESUMEN DEL DEPLOY:"
echo "======================"
echo "Frontend: $FRONTEND_LOCAL → $VPS_HOST:$FRONTEND_REMOTE"
echo "Backend:  $BACKEND_LOCAL → $VPS_HOST:$BACKEND_REMOTE"
echo ""
echo "🔍 PARA VERIFICAR MANUALMENTE:"
echo "1. Frontend: https://$VPS_HOST/"
echo "2. Backend API: http://$VPS_HOST:8090/api/health"
echo "3. Admin Panel: http://$VPS_HOST:8090/_/"
echo ""
echo "🛠️  COMANDOS ÚTILES:"
echo "   ssh $VPS_USER@$VPS_HOST"
echo "   cd $BACKEND_REMOTE && docker-compose logs -f"
echo "   tail -f /home/$VPS_USER/public_html/error.log"
echo ""
print_status "Deploy completado! 🎉"

# Guardar log del deploy
echo "$(date): Deploy a $VPS_HOST" >> deploy.log
echo "  Frontend: $FRONTEND_LOCAL" >> deploy.log
echo "  Backend: $BACKEND_LOCAL" >> deploy.log
echo "" >> deploy.log