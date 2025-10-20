# Configuración de Gmail para Envío de Correos

## Pasos para configurar Gmail:

### 1. Habilitar Autenticación de 2 Factores
1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Selecciona "Seguridad" en el menú lateral
3. En "Iniciar sesión en Google", habilita la "Verificación en 2 pasos"

### 2. Generar Contraseña de Aplicación
1. En la misma sección de "Seguridad"
2. Busca "Contraseñas de aplicaciones"
3. Selecciona "Correo" y "Otro (nombre personalizado)"
4. Escribe "Calendar App" como nombre
5. Copia la contraseña generada (16 caracteres)

### 3. Configurar Variables de Entorno
Actualiza el archivo `.env` con:

```
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=la-contraseña-de-16-caracteres-generada
```

### 4. Verificar Configuración
- Reinicia el servidor backend
- Prueba la función "Olvidé mi contraseña"
- Revisa la consola para logs de envío

## Solución de Problemas:

### Error "Invalid login"
- Verifica que la contraseña de aplicación sea correcta
- Asegúrate de que la autenticación de 2 factores esté habilitada

### Error "Less secure app access"
- Gmail ya no permite aplicaciones menos seguras
- DEBES usar contraseñas de aplicación

### Error de conexión
- Verifica tu conexión a internet
- Algunos firewalls pueden bloquear el puerto 587