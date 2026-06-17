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

