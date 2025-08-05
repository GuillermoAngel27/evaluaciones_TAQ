# Usuario Administrador Automático

## Descripción

El sistema automáticamente crea un usuario administrador maestro al iniciar el backend si este no existe en la base de datos.

## Credenciales del Usuario Admin

- **Username:** `admin`
- **Password:** `admin2025`
- **Rol:** `administrador`
- **Nombre:** `Administrador`
- **Apellido:** `Sistema`
- **Estado:** `activo`

## Funcionamiento

### Al Iniciar el Sistema

Cuando se ejecuta `start_backend.js`, el sistema:

1. Se conecta a la base de datos MySQL
2. Verifica si existe un usuario con username `admin`
3. Si no existe, crea automáticamente el usuario admin con las credenciales especificadas
4. Si ya existe, no hace nada (evita duplicados)

### Logs del Sistema

El sistema mostrará mensajes informativos en la consola:

```
✅ Conectado a MySQL exitosamente
✅ Usuario admin ya existe, no se necesita crear
```

O si es la primera vez:

```
✅ Conectado a MySQL exitosamente
✅ Usuario admin creado exitosamente
   Username: admin
   Password: admin2025
   Rol: administrador
```

## Seguridad

- La contraseña se hashea usando bcrypt con salt rounds de 10
- El usuario se crea con rol de `administrador` para acceso completo al sistema
- Solo se crea si no existe, evitando duplicados

## Pruebas

Para probar la funcionalidad manualmente:

```bash
# Ejecutar el script de prueba
npm run test-admin

# O directamente
node test_admin_user.js
```

## Verificación en Base de Datos

Puedes verificar que el usuario existe ejecutando esta consulta SQL:

```sql
SELECT id, username, nombre, apellido, rol, activo, fecha_creacion 
FROM usuarios 
WHERE username = 'admin';
```

## Notas Importantes

- **Cambio de Contraseña:** Se recomienda cambiar la contraseña del usuario admin después del primer login por seguridad
- **Eliminación:** El usuario admin no se puede eliminar automáticamente, solo se crea si no existe
- **Backup:** Asegúrate de tener un backup de la base de datos antes de hacer cambios importantes

## Troubleshooting

### Error de Conexión
Si hay problemas de conexión a la base de datos, verifica:
1. Que MySQL esté corriendo
2. Las credenciales en el archivo `.env`
3. Que la base de datos exista

### Error de Permisos
Si hay problemas de permisos, asegúrate de que el usuario de la base de datos tenga permisos de:
- SELECT en la tabla `usuarios`
- INSERT en la tabla `usuarios`
- CREATE en la base de datos (si las tablas no existen) 