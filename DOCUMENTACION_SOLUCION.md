# Sistema de Validación y Solicitud de Uniformes - HighLanders

## Documento Explicativo de la Solución

---

## 1. El Problema Identificado

Actualmente, la empresa HighLanders gestiona las solicitudes de uniformes de sus jugadores a través de un formulario digital. Sin embargo, existe una regla operativa crítica que no está automatizada:

> **La combinación Número de Camiseta + Categoría + Sede debe ser única.**

Esto significa que no pueden existir dos jugadores activos con el mismo número en la misma categoría y sede. Por ejemplo, en la Sede A - Categoría Sub-10 no puede haber dos jugadores con el número 10.

Esta validación se realizaba de forma manual, revisando una base de datos de jugadores ya registrados, lo que generaba:
- **Errores humanos** al validar
- **Retrabajo** cuando se detectaban números duplicados después de procesar la solicitud
- **Fricción operativa** entre representantes y administradores
- **Demoras** en el proceso de solicitud

Además, el formulario no contaba con una base de datos centralizada que permitiera dar seguimiento a las solicitudes, generando desorden administrativo.

---

## 2. La Lógica de la Solución

La solución implementada sigue un flujo lógico claro:

### 2.1. Validación en Tiempo Real

El corazón del sistema es la **validación automática en tiempo real**. Mientras el representante llena el formulario, el sistema verifica al instante si el número de camiseta está disponible:

```
Usuario ingresa número → 
  → Frontend envía solicitud AJAX a la API →
    → Backend consulta base de datos →
      → Si el número está ocupado → mensaje de error → bloquea envío
      → Si el número está disponible → mensaje de éxito → permite continuar
```

### 2.2. Regla de Negocio Implementada

La validación se basa en la siguiente lógica:

```
¿Existe un jugador ACTIVO con el mismo número 
  EN LA MISMA categoría 
    Y EN LA MISMA sede?
    
SÍ  → Número NO disponible ❌
NO  → ¿Hay una solicitud PENDIENTE con esa combinación?
       SÍ  → Número NO disponible ❌
       NO  → Número disponible ✅
```

El mismo número PUEDE repetirse si cambia la categoría O la sede. Esto está modelado correctamente en la base de datos mediante consultas que filtran por los tres campos simultáneamente.

### 2.3. Flujo de Usuario Completo

```
1. Representante accede al formulario público
2. Ingresa datos del jugador (nombre completo)
3. Ingresa nombre para la camiseta (apodo, creativo, etc.)
4. Ingresa el significado o contexto del nombre
5. Selecciona categoría y sede
6. Ingresa número de camiseta
   ├── ⏳ Sistema valida en tiempo real (500ms de pausa)
   ├── ✅ Número disponible → indicador verde
   └── ❌ Número no disponible → mensaje claro + bloqueo
7. Selecciona tipo de uniforme (checkboxes)
8. Ingresa talla
9. Describe celebración del jugador
10. Acepta términos
11. Envía solicitud
12. ✅ Recibe ticket de seguimiento
```

---

## 3. La Arquitectura Elegida

Se optó por una arquitectura **monoambiente (monorepo)** utilizando **Next.js** con **App Router**. Todo el sistema está centralizado en un único proyecto.

### 3.1. Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js (App Router)                    │
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Frontend     │  │ Route        │  │ Server Actions  │  │
│  │ (React +     │  │ Handlers     │  │ (Form Submit)   │  │
│  │  Tailwind)   │  │ (API REST)   │  │                 │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
│         │                 │                    │           │
│  ┌──────┴─────────────────┴────────────────────┴────────┐ │
│  │                    Servicios                          │ │
│  │  (Validación, Jugadores, Solicitudes, Importación)    │ │
│  └──────────────────────┬───────────────────────────────┘ │
│                         │                                  │
│  ┌──────────────────────┴───────────────────────────────┐ │
│  │              Prisma ORM + PostgreSQL                  │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3.2. Separación en Capas

| Capa | Responsabilidad | Tecnología |
|------|----------------|------------|
| **UI** | Interfaz de usuario, formularios, tablas | React Server/Client Components, Tailwind CSS |
| **API** | Endpoints REST para validación y consultas | Next.js Route Handlers |
| **Servicios** | Lógica de negocio pura, sin conocimiento de HTTP | TypeScript services |
| **Acceso a Datos** | Consultas a la base de datos | Prisma ORM |
| **Base de Datos** | Almacenamiento persistente | PostgreSQL |

### 3.3. Estructura de Carpetas

```
highlanders-uniforms/
├── prisma/                          # Schema BD, migraciones y seed
├── src/
│   ├── app/
│   │   ├── (public)/                # Rutas públicas (formulario)
│   │   ├── (admin)/                 # Rutas protegidas (dashboard)
│   │   └── api/                     # API REST
│   ├── components/ui/               # Componentes reutilizables
│   ├── lib/                         # Utilidades, constantes, validaciones Zod
│   ├── services/                    # Lógica de negocio
│   └── types/                       # Tipos compartidos
└── scripts/                         # Scripts auxiliares
```

---

## 4. Por Qué Elegí Este Camino

### 4.1. ¿Por qué Next.js en lugar de una solución con Google Apps Script?

| Aspecto | Next.js | Google Apps Script |
|---------|---------|-------------------|
| **Escalabilidad** | Ilimitada (PostgreSQL) | Limitada ( Sheets) |
| **Experiencia de usuario** | UI moderna, rápida, responsive | UI limitada |
| **Control de datos** | Total (BD propia) | Dependencia de Google |
| **Mantenibilidad** | Código TypeScript moderno | JavaScript limitado |
| **Despliegue** | Railway, Vercel, cualquier cloud | Solo ecosistema Google |

**Decisión:** Next.js gana porque el proyecto necesita crecer, tener una UI profesional y control total sobre los datos.

### 4.2. ¿Por qué Prisma + PostgreSQL?

Prisma ofrece:
- **Type safety**: El ORM genera tipos TypeScript automáticamente
- **Migraciones**: Control de versiones de la base de datos
- **Seed**: Población inicial de datos automatizada
- **Relaciones**: Modelado limpio de entidades

### 4.3. ¿Por qué validación en Frontend + Backend?

- **Frontend**: Validación en tiempo real (AJAX) para mejor UX
- **Backend**: Doble validación con Zod en Server Actions para seguridad
- **BD**: Restricciones de unicidad como capa final de protección

---

## 5. Qué Valida Cada Parte del Sistema

### 5.1. Frontend (React Hook Form + Zod)

| Campo | Validación |
|-------|-----------|
| Nombre completo | Mín. 3 caracteres, máx. 200 |
| Nombre en camiseta | Mín. 1 carácter, máx. 50 |
| Contexto/significado | Mín. 10 caracteres, máx. 500 |
| Número de camiseta | Solo dígitos, entre 1 y 99 |
| Categoría | Obligatoria (selección) |
| Sede | Obligatoria (selección) |
| Tipo de uniforme | Al menos 1 selección |
| Talla | Obligatoria |
| Celebración | Mín. 10 caracteres, máx. 500 |

### 5.2. Backend (API)

- **`POST /api/validate-number`**: Recibe número + categoría + sede → consulta BD → responde disponibilidad
- **`POST /api/auth/login`**: Recibe email + password → verifica contra BD → devuelve JWT
- **`POST /api/import`**: Recibe archivo Excel → procesa e importa → registra log
- **`GET /api/catalog`**: Devuelve catálogos completos (categorías, sedes, tipos, tallas)

### 5.3. Base de Datos

- **Restricción única implícita**: La combinación `(jerseyNumber, categoryId, venueId)` debe ser única para jugadores activos
- **Integridad referencial**: Todas las relaciones tienen llaves foráneas
- **Índices**: Optimización de consultas por estado, categoría y sede

---

## 6. Qué Ocurre Cuando el Número NO Está Disponible

Si un representante ingresa un número que ya está asignado a otro jugador activo en la misma categoría y sede:

1. **Indicador visual inmediato**: El campo del número se marca con un borde rojo
2. **Mensaje claro**: Aparece un mensaje como:
   > "El número 10 ya está asignado a Juan Pérez en Sub-10 - A. La Pampa. Por favor, elige otro número."
3. **Botón de envío bloqueado**: El formulario no permite enviarse hasta que se solucione
4. **Sugerencia implícita**: El usuario debe cambiar el número o seleccionar otra categoría/sede

**Simulación visual:**
```
┌─────────────────────────────────────────────────┐
│ Número en la camiseta  [ 10 ] ⚠️               │
│                                                   │
│ ┌─────────────────────────────────────────────┐ │
│ │ ❌ El número 10 ya está asignado a Juan     │ │
│ │    Pérez en Sub-10 - A. La Pampa. Por favor │ │
│ │    elige otro número.                       │ │
│ └─────────────────────────────────────────────┘ │
│                                                   │
│ [Enviar Solicitud] ← DESHABILITADO               │
└─────────────────────────────────────────────────┘
```

El sistema también verifica solicitudes **pendientes**, no solo jugadores ya registrados, para evitar conflictos futuros.

---

## 7. Qué Ocurre Cuando el Número SÍ Está Disponible

Cuando el número está disponible:

1. **Indicador visual positivo**: El campo se marca con un borde verde
2. **Mensaje de confirmación**: 
   > "¡El número 10 está disponible!"
3. **Icono de check**: Aparece un ícono de verificación verde
4. **Botón de envío habilitado**: El usuario puede continuar y enviar
5. **Persistencia**: La validación se mantiene incluso si el usuario edita otros campos

**Simulación visual:**
```
┌─────────────────────────────────────────────────┐
│ Número en la camiseta  [ 10 ] ✅               │
│                                                   │
│ ┌─────────────────────────────────────────────┐ │
│ │ ✅ ¡El número 10 está disponible!           │ │
│ └─────────────────────────────────────────────┘ │
│                                                   │
│ [Enviar Solicitud] ← HABILITADO                  │
└─────────────────────────────────────────────────┘
```

---

## 8. Tiempo Total Aproximado de Desarrollo

| Fase | Tiempo |
|------|--------|
| Análisis de requerimientos y diseño de solución | 4 horas |
| Configuración del proyecto y base de datos | 2 horas |
| Implementación del modelo de datos (Prisma) | 2 horas |
| Desarrollo del formulario público + validación | 4 horas |
| Desarrollo del panel administrativo | 4 horas |
| Implementación de importación de Excel | 2 horas |
| Sistema de autenticación | 2 horas |
| APIs REST | 2 horas |
| Pruebas y correcciones | 3 horas |
| Configuración de despliegue (Railway) | 1 hora |
| **Total estimado** | **~26 horas** |

---

## 9. Limitaciones Actuales

1. **Autenticación básica**: El sistema usa JWT con cookie, no cuenta con OAuth, 2FA ni recuperación de contraseña. Para un entorno productivo real, recomendaría implementar NextAuth.js.

2. **Sin notificaciones**: Actualmente no hay sistema de emails ni notificaciones push. El representante no recibe un correo de confirmación ni alertas de cambios de estado.

3. **Importación manual del Excel**: Los datos del Excel deben subirse manualmente desde el panel admin. No hay sincronización automática con Google Sheets.

4. **Sin roles avanzados**: Solo existe admin y superadmin. No hay perfiles como "entrenador", "representante" o "coordinador".

5. **Sin edición de solicitudes**: Una vez enviada, la solicitud solo puede cambiar de estado (Pendiente → Aprobada → Entregada). No se puede editar el contenido.

6. **Sin historial de cambios**: No se registra quién cambió qué ni cuándo (auditoría).

---

## 10. Posibles Mejoras Futuras

1. **Integración con Google Sheets**: Sincronización automática bidireccional entre la BD y Google Sheets para mantener actualizado el registro centralizado.

2. **Notificaciones por email**: Enviar confirmación al representante cuando se apruebe, rechace o entregue la solicitud.

3. **Autenticación con NextAuth.js**: Proveedores OAuth (Google, Facebook), 2FA, recuperación de contraseña, roles más granulares.

4. **Panel del representante**: Que cada representante pueda ver el historial de solicitudes de sus jugadores.

5. **Gestión de tallas**: Catálogo completo de tallas con guía de medidas y sugerencia automática según edad/estatura.

6. **Carga de imágenes**: Permitir subir foto del jugador y del diseño del uniforme.

7. **API pública**: Exponer endpoints documentados para integraciones con otros sistemas.

8. **Auditoría de cambios**: Registro detallado de todas las modificaciones con usuario y timestamp.

9. **Dashboard avanzado**: Gráficas interactivas, reportes descargables (PDF/Excel), filtros avanzados.

10. **App móvil**: Versión mobile nativa con React Native para que los representantes puedan hacer solicitudes desde el teléfono.

---

## 11. Alternativas Técnicas Consideradas

### 11.1. Google Apps Script + Google Sheets

**Ventajas:** 
- Sin costo de infraestructura
- Rápido de prototipar
- Integración nativa con Google Forms

**Desventajas:**
- Límites de ejecución (6 min por script)
- UI extremadamente limitada
- Sin base de datos relacional
- Difícil de escalar y mantener

**Decisión:** ❌ Rechazado por limitaciones de escalabilidad

### 11.2. NODE.js + Express + React Separados (Frontend y Backend)

**Ventajas:**
- Separación clara de responsabilidades
- Cada servicio escala independientemente

**Desventajas:**
- Mayor complejidad operativa (2 deploys, 2 dominios, CORS)
- Más carpetas y repositorios que mantener
- Overhead innecesario para el tamaño del proyecto

**Decisión:** ❌ Rechazado por complejidad innecesaria

### 11.3. Next.js (App Router) — La Elegida ✅

**Ventajas:**
- Todo en un mismo proyecto: frontend, backend y API
- Server Components para rendimiento óptimo
- Server Actions para mutations seguras
- Despliegue sencillo en Railway
- Escalable: si crece, se puede migrar a microservicios manteniendo los servicios

**Decisión:** ✅ Elegida por simplicidad, potencia y proyección a futuro

### 11.4. Base de Datos: SQLite vs PostgreSQL

**SQLite:**
- Más simple, sin servidor
- No funciona en Railway (sin disco persistente)
- Sin concurrencia real

**PostgreSQL:**
- Estándar de la industria
- Soporte nativo de Railway
- Concurrencia, índices, restricciones

**Decisión:** ✅ PostgreSQL por robustez y compatibilidad con Railway

---

## 12. Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.2.12 | Framework principal (App Router) |
| TypeScript | 5.x | Tipado estático |
| React | 19.x | UI Components |
| Prisma | 5.22.0 | ORM y migraciones |
| PostgreSQL | 17 | Base de datos |
| Tailwind CSS | 4.x | Estilos |
| Zod | 4.x | Validaciones |
| React Hook Form | 7.x | Manejo de formularios |
| JWT | - | Autenticación |
| XLSX | 0.18.x | Lectura de Excel |

---

## 13. Conclusión

La solución implementada resuelve el problema de raíz: **automatiza la validación del número de camiseta en tiempo real**, eliminando por completo los errores manuales y el retrabajo.

El sistema es:
- **Rápido**: Validación en menos de 500ms
- **Seguro**: Doble validación (cliente + servidor)
- **Escalable**: Puede crecer a cientos de miles de registros
- **Mantenible**: Código limpio, documentado y modular
- **Desplegado**: Listo para producción en Railway

La arquitectura elegida (Next.js monorepo con servicios separados) permite que el sistema evolucione sin reescrituras costantes: cuando el proyecto crezca, cada servicio puede migrarse a un microservicio independiente sin cambiar la lógica de negocio.

---

*Documento preparado para HighLanders - Sistema Formativo de Alto Rendimiento en Fútbol*
